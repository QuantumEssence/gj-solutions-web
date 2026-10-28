import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import {
  createInquiry,
  getAllInquiries,
  getTrashInquiries,
  softDeleteInquiry,
  restoreInquiry,
  permanentlyDeleteInquiry,
  updateInquiryStatus,
  recordPageView,
  getAnalyticsSummary,
  trashAllActiveInquiries,
  purgeAllTrashedInquiries,
  resetAllInquiries,
  resetPageViews,
  seedBetaInquiries,
  getSiteContent,
  updateSiteContent
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==============================================================================
// 1. Session Token & Authentication Hardening (node:crypto)
// ==============================================================================
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'athena-secure-session-key-32b-secret-fallback';
const SESSION_EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS, 10) || 8;

/**
 * Generates a cryptographically signed, time-bounded session bearer token.
 */
export function createSessionToken(payload = {}) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_EXPIRY_HOURS * 3600 * 1000;
  const tokenData = {
    ...payload,
    role: 'admin',
    iat: issuedAt,
    exp: expiresAt,
    nonce: crypto.randomBytes(16).toString('hex')
  };

  const encodedPayload = Buffer.from(JSON.stringify(tokenData)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Validates a signed bearer token with constant-time signature comparison and expiration checks.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expSigBuf = Buffer.from(expectedSignature, 'utf8');

  if (sigBuf.length !== expSigBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expSigBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return null; // Expired
    }
    if (payload.role !== 'admin') {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

let runtimeAdminSecret = null;

export function getAdminSecret() {
  return runtimeAdminSecret || process.env.ADMIN_PASSWORD || 'EpicTheMusicalAthena';
}

export function setAdminSecret(newSecret) {
  runtimeAdminSecret = newSecret;
}

/**
 * Timing-attack resistant secret verification using SHA-256 and matched-length crypto.timingSafeEqual.
 */
export function verifyAdminSecret(provided) {
  const adminSecret = getAdminSecret();
  if (typeof provided !== 'string') return false;

  const providedHash = crypto.createHash('sha256').update(provided.trim()).digest();
  const secretHash = crypto.createHash('sha256').update(adminSecret.trim()).digest();

  return crypto.timingSafeEqual(providedHash, secretHash);
}

// Middleware to verify administrative authorization token
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    const session = verifySessionToken(token);
    if (session) {
      req.adminSession = session;
      return next();
    }
  }

  return res.status(401).json({
    error: 'Unauthorized: Valid administrative session token required.'
  });
}

// Helper to hash IP address for privacy while tracking unique visitors
function getClientIpHash(req) {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = (Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0]).trim();
  return crypto.createHash('sha256').update(String(ip)).digest('hex').substring(0, 16);
}

// ==============================================================================
// 2. Sliding Window Rate Limiting & Abuse Prevention
// ==============================================================================
const rateLimitStores = new Set();

/**
 * Resets all in-memory rate limiting counters (used for maintenance / automated testing).
 */
export function resetRateLimits() {
  for (const store of rateLimitStores) {
    store.clear();
  }
}

export function createRateLimiter({
  windowMs = 60000,
  max = 10,
  message = 'Too many requests, please try again later.'
} = {}) {
  const hits = new Map();
  rateLimitStores.add(hits);

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of hits.entries()) {
      const valid = timestamps.filter(ts => now - ts < windowMs);
      if (valid.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, valid);
      }
    }
  }, Math.max(windowMs, 30000));

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = (Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0]).trim();
    const key = `${clientIp}:${req.baseUrl || ''}${req.path}`;

    const timestamps = hits.get(key) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= max) {
      const oldest = validTimestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));

      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', String(Math.ceil((oldest + windowMs) / 1000)));

      return res.status(429).json({
        error: message,
        retryAfter: retryAfterSeconds
      });
    }

    validTimestamps.push(now);
    hits.set(key, validTimestamps);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - validTimestamps.length)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));

    next();
  };
}

const loginRateLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX) || 10,
  message: 'Too many administrative login attempts. Please try again later.'
});

const inquiriesRateLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_INQUIRIES_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_INQUIRIES_MAX) || 30,
  message: 'Too many inquiries submitted from this IP address. Please try again later.'
});

const analyticsRateLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_ANALYTICS_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_ANALYTICS_MAX) || 120,
  message: 'Analytics tracking rate limit exceeded. Please throttle requests.'
});

// ==============================================================================
// 3. Modular Email Notification Pipeline & Branded Clinic Template
// ==============================================================================
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateClinicEmailTemplate({
  name,
  inquiryId,
  serviceInterest,
  scheduleMeeting,
  customNote
}) {
  const practitionerName = escapeHtml(name || 'Practitioner');
  const refId = escapeHtml(inquiryId || 'NEW');
  const service = escapeHtml(serviceInterest || 'Clinical Administrative Practice Support');
  const meeting = escapeHtml(scheduleMeeting || 'To be confirmed');
  const note = escapeHtml(
    customNote ||
      'Thank you for reaching out to G&J Solutions. Our practice coordinator will contact you shortly.'
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>G&amp;J Solutions - Practice Support Update</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #0f2b48; padding: 24px 32px; border-bottom: 3px solid #0ea5e9; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px 20px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eef2f6; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .val { color: #0f172a; font-weight: 600; text-align: right; }
    .note-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px; }
    .note-title { font-size: 12px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 4px; }
    .note-text { font-size: 14px; line-height: 1.5; color: #1e3a8a; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 11px; line-height: 1.5; color: #64748b; }
    .compliance-tag { color: #059669; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>G&amp;J SOLUTIONS</h1>
      <p>Australian Sports &amp; Musculoskeletal Practice Administrative Support</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${practitionerName},</div>
      <p class="lead">
        Thank you for connecting with G&amp;J Solutions. We have received your inquiry regarding our clinical administrative and practice workflow services.
      </p>
      <div class="card">
        <div class="row"><span class="label">Inquiry Reference:</span><span class="val">#${refId}</span></div>
        <div class="row"><span class="label">Service Focus:</span><span class="val">${service}</span></div>
        <div class="row"><span class="label">Discovery Schedule:</span><span class="val">${meeting}</span></div>
        <div class="row"><span class="label">Operating Region:</span><span class="val">VIC / NSW / QLD (AEST/AEDT)</span></div>
      </div>
      <div class="note-box">
        <div class="note-title">Coordinator Follow-Up Note</div>
        <div class="note-text">${note}</div>
      </div>
    </div>
    <div class="footer">
      <p><strong>G&amp;J Solutions Practice Management Support</strong> &bull; ABN Registered &bull; Melbourne, VIC</p>
      <p><span class="compliance-tag">&bull; APPs COMPLIANCE NOTICE:</span> This communication is conducted in strict compliance with the Australian Privacy Principles under the Privacy Act 1988 (Cth). In accordance with our Practice Support MOA, no patient health information (PHI), clinical diagnoses, or medical records are solicited or accepted.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function dispatchEmailNotification({
  to,
  name,
  inquiryId,
  serviceInterest,
  scheduleMeeting,
  customNote
}) {
  const fromEmail = process.env.EMAIL_FROM || 'G&J Solutions <notifications@gjsolutions.com.au>';
  const subject = `Follow-Up: Administrative Support Inquiry [#${inquiryId || 'NEW'}] - G&J Solutions`;

  const htmlContent = generateClinicEmailTemplate({
    name,
    inquiryId,
    serviceInterest,
    scheduleMeeting,
    customNote
  });

  const textContent =
    `Dear ${name || 'Practitioner'},\n\n` +
    `Thank you for your inquiry with G&J Solutions regarding administrative & practice management support.\n\n` +
    `Inquiry ID: #${inquiryId || 'N/A'}\n` +
    `Service Interest: ${serviceInterest || 'General Practice Support'}\n` +
    `Meeting Schedule: ${scheduleMeeting || 'To be confirmed'}\n` +
    `Coordinator Note: ${customNote || 'Thank you for contacting us. Our practice coordinator will be in touch shortly.'}\n\n` +
    `Australian Privacy Principles (APPs) Compliant. No PHI or patient health records are accepted.`;

  const provider = (process.env.EMAIL_PROVIDER || '').toLowerCase();
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  // 1. Resend Provider
  if ((provider === 'resend' || (!provider && resendKey)) && resendKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html: htmlContent,
        text: textContent
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Resend API error (${res.status}): ${JSON.stringify(data)}`);
    return { provider: 'resend', messageId: data.id, status: 'dispatched' };
  }

  // 2. SendGrid Provider
  if ((provider === 'sendgrid' || (!provider && sendgridKey)) && sendgridKey) {
    const cleanFrom = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: cleanFrom },
        subject,
        content: [
          { type: 'text/plain', value: textContent },
          { type: 'text/html', value: htmlContent }
        ]
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`SendGrid API error (${res.status}): ${errText}`);
    }
    return {
      provider: 'sendgrid',
      messageId: res.headers.get('x-message-id') || `sg_${Date.now()}`,
      status: 'dispatched'
    };
  }

  // 3. Postmark Provider
  if ((provider === 'postmark' || (!provider && postmarkToken)) && postmarkToken) {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': postmarkToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        From: fromEmail,
        To: to,
        Subject: subject,
        HtmlBody: htmlContent,
        TextBody: textContent
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Postmark API error (${res.status}): ${JSON.stringify(data)}`);
    return { provider: 'postmark', messageId: data.MessageID, status: 'dispatched' };
  }

  // 4. Default Fallback: Clean structured debug transporter
  const mockId = `mock_dispatch_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  console.log(`[Email Dispatcher: Debug Transporter] Dispatch simulated for ${to}:`, {
    messageId: mockId,
    recipient: to,
    inquiryId,
    provider: 'structured-debug-transporter',
    subject,
    note: customNote || 'Standard clinical coordination follow-up'
  });

  return {
    provider: 'structured-debug-transporter',
    messageId: mockId,
    status: 'simulated_debug_fallback',
    dispatchedTo: to
  };
}

// ==============================================================================
// 4. API Endpoints
// ==============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'G&J Solutions API', timestamp: new Date().toISOString() });
});

// Submit contact questionnaire (Protected with rate limiter and input/PHI guards)
app.post('/api/inquiries', inquiriesRateLimiter, async (req, res) => {
  try {
    const { name, email, isSPMC, serviceInterest, scheduleMeeting } = req.body || {};

    if (!name || !email || !isSPMC || !serviceInterest || !scheduleMeeting) {
      return res.status(400).json({
        error:
          'Missing required questionnaire fields (name, email, isSPMC, serviceInterest, scheduleMeeting).'
      });
    }

    // Input length ceiling defense against buffer abuse
    if (typeof name !== 'string' || name.length > 200) {
      return res.status(400).json({ error: 'Name must be 200 characters or fewer.' });
    }
    if (typeof email !== 'string' || email.length > 254) {
      return res.status(400).json({ error: 'Email must be 254 characters or fewer.' });
    }
    if (typeof scheduleMeeting !== 'string' || scheduleMeeting.length > 500) {
      return res.status(400).json({ error: 'Meeting details must be 500 characters or fewer.' });
    }

    // Strict compliance check: MOA bars patient health information / medical records across all fields
    const combinedContent = `${name} ${email} ${serviceInterest} ${scheduleMeeting}`.toLowerCase();
    const prohibitedKeywords = [
      'patient',
      'diagnosis',
      'medical record',
      'prescription',
      'medication',
      'phi'
    ];
    const detectedKeyword = prohibitedKeywords.find(kw => combinedContent.includes(kw));
    if (detectedKeyword) {
      return res.status(400).json({
        error:
          'Strict Data Privacy Restriction: Inquiries must not contain patient health information or medical records.'
      });
    }

    const inquiry = await createInquiry({
      name: name.trim(),
      email: email.trim(),
      isSPMC,
      serviceInterest,
      scheduleMeeting
    });

    // Automated Admin Email Alert on Submission (non-blocking)
    const adminAlertEmail = process.env.ADMIN_ALERT_EMAIL || 'clinic-admin@gjsolutions.com.au';
    dispatchEmailNotification({
      to: adminAlertEmail,
      name: `Clinical Coordinator (re: ${inquiry.name})`,
      inquiryId: inquiry.id,
      serviceInterest: inquiry.service_interest,
      scheduleMeeting: inquiry.schedule_meeting,
      customNote: `New consultation inquiry submitted by ${inquiry.name} (${inquiry.email}). SPMC: ${inquiry.is_spmc}. Meeting: ${inquiry.schedule_meeting}.`
    }).catch(dispatchErr => {
      console.error('[Admin Alert] Background email dispatch failed (non-blocking):', dispatchErr?.message || dispatchErr);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry successfully received and stored.',
      inquiry
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to save inquiry.' });
  }
});

// Admin authentication gate endpoint (Protected against brute-force and timing attacks)
app.post('/api/admin/login', loginRateLimiter, (req, res) => {
  const { password, passcode } = req.body || {};
  const provided = (password || passcode || '');

  if (typeof provided === 'string' && verifyAdminSecret(provided)) {
    const token = createSessionToken();
    return res.json({
      success: true,
      token,
      message: 'Admin access authorized.'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrative passcode. Please check your credentials.'
  });
});

// Secure administrative passcode update endpoint
app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  try {
    const { currentPasscode, newPasscode } = req.body || {};

    if (!currentPasscode || typeof currentPasscode !== 'string') {
      return res.status(400).json({ error: 'Current passcode is required.' });
    }

    if (!verifyAdminSecret(currentPasscode)) {
      return res.status(401).json({ error: 'Current passcode is incorrect.' });
    }

    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 8) {
      return res.status(400).json({ error: 'New passcode must be at least 8 characters long.' });
    }

    setAdminSecret(newPasscode.trim());
    console.log('[Security Audit] Administrative passcode updated in runtime memory.');

    return res.json({
      success: true,
      message: 'Passcode updated successfully.'
    });
  } catch (error) {
    console.error('Error changing passcode:', error);
    res.status(500).json({ error: error.message || 'Failed to update passcode.' });
  }
});

// Dynamic Site Content Endpoints (CMS for Hero, Mission, FAQs, Testimonials)
app.get('/api/content', async (req, res) => {
  try {
    const content = await getSiteContent('homepage');
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve site content.' });
  }
});

app.put('/api/content', requireAdminAuth, async (req, res) => {
  try {
    const contentPayload = req.body?.content || req.body;
    if (!contentPayload || typeof contentPayload !== 'object' || Array.isArray(contentPayload)) {
      return res.status(400).json({ error: 'Invalid content payload. Expected a valid JSON object.' });
    }

    const updated = await updateSiteContent('homepage', contentPayload);
    res.json({
      success: true,
      message: 'Site content updated successfully.',
      content: updated
    });
  } catch (error) {
    console.error('Error updating site content:', error);
    res.status(500).json({ error: error.message || 'Failed to update site content.' });
  }
});

// Settings & Data Cleaning Endpoint
app.post('/api/admin/clean', requireAdminAuth, async (req, res) => {
  try {
    const { mode } = req.body || {};

    if (mode === 'reset_rate_limits') {
      resetRateLimits();
      return res.json({
        success: true,
        message: 'All in-memory rate limiting counters reset successfully.'
      });
    }

    if (mode === 'trash_all') {
      const moved = await trashAllActiveInquiries();
      return res.json({
        success: true,
        message: `Moved ${moved.length} inquiries to Trash Bin.`,
        count: moved.length
      });
    }

    if (mode === 'purge_trash') {
      const deletedCount = await purgeAllTrashedInquiries();
      return res.json({
        success: true,
        message: `Permanently deleted ${deletedCount} inquiries from Trash Bin.`,
        count: deletedCount
      });
    }

    if (mode === 'reset_all') {
      await resetAllInquiries();
      return res.json({
        success: true,
        message: 'All saved inquiries wiped completely for beta test.'
      });
    }

    if (mode === 'reset_analytics') {
      await resetPageViews();
      return res.json({ success: true, message: 'Analytics traffic counters reset to 0.' });
    }

    if (mode === 'seed_beta') {
      const seeded = await seedBetaInquiries();
      return res.json({
        success: true,
        message: `Loaded ${seeded.length} beta test inquiries.`,
        count: seeded.length
      });
    }

    return res.status(400).json({ error: 'Invalid cleaning mode specified.' });
  } catch (error) {
    console.error('Data management error:', error);
    res.status(500).json({ error: error.message || 'Failed to execute maintenance operation.' });
  }
});

// Email Re-Notification Endpoint (Modular dispatcher with Australian clinic template)
app.post('/api/admin/notify', requireAdminAuth, async (req, res) => {
  try {
    const { inquiryId, email, name, serviceInterest, scheduleMeeting, customNote } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid recipient email is required for re-notification.' });
    }

    const dispatchResult = await dispatchEmailNotification({
      to: email.trim(),
      name: name?.trim(),
      inquiryId,
      serviceInterest,
      scheduleMeeting,
      customNote
    });

    res.json({
      success: true,
      message: `Re-notification email successfully dispatched to ${email}.`,
      dispatch: {
        recipient: email,
        inquiryId,
        provider: dispatchResult.provider,
        messageId: dispatchResult.messageId,
        status: dispatchResult.status,
        sentAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message || 'Failed to dispatch email notification.' });
  }
});

// Fetch inquiries for admin portal (supports ?trash=true or ?deleted=true)
app.get('/api/inquiries', requireAdminAuth, async (req, res) => {
  try {
    const isTrash = req.query.trash === 'true' || req.query.deleted === 'true';
    const inquiries = isTrash ? await getTrashInquiries() : await getAllInquiries();
    res.json({ success: true, inquiries, isTrash });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve inquiries.' });
  }
});

// Move inquiry to Trash Bin (soft delete per Oct 5 meeting requirement)
app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await softDeleteInquiry(Number(id));
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ success: true, message: 'Inquiry moved to Trash Bin.', inquiry });
  } catch (error) {
    console.error('Error soft-deleting inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to move inquiry to Trash Bin.' });
  }
});

// Restore inquiry from Trash Bin
app.post('/api/inquiries/:id/restore', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await restoreInquiry(Number(id));
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found in Trash Bin.' });
    }
    res.json({ success: true, message: 'Inquiry restored successfully.', inquiry });
  } catch (error) {
    console.error('Error restoring inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to restore inquiry.' });
  }
});

// Permanently delete inquiry from Trash Bin
app.delete('/api/inquiries/:id/permanent', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await permanentlyDeleteInquiry(Number(id));
    if (!success) {
      return res.status(404).json({ error: 'Inquiry not found in Trash Bin.' });
    }
    res.json({ success: true, message: 'Inquiry permanently deleted.' });
  } catch (error) {
    console.error('Error permanently deleting inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to permanently delete inquiry.' });
  }
});

// Update inquiry review status
app.patch('/api/inquiries/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatuses = ['Pending Review', 'Meeting Scheduled', 'Replied via Email'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const updated = await updateInquiryStatus(Number(id), status);
    if (!updated) {
      return res.status(400).json({ error: 'Inquiry not found.' });
    }

    res.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: error.message || 'Failed to update inquiry status.' });
  }
});

// Track page view for traffic analytics (Protected with rate limiter)
app.post('/api/analytics/track', analyticsRateLimiter, async (req, res) => {
  try {
    const { path: pagePath = '/' } = req.body || {};
    const ipHash = getClientIpHash(req);
    const userAgent = req.headers['user-agent'] || '';

    await recordPageView({ path: pagePath, ipHash, userAgent });
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: error.message || 'Failed to log analytics visit.' });
  }
});

// Analytics overview summary for admin dashboard
app.get('/api/analytics/summary', requireAdminAuth, async (req, res) => {
  try {
    const summary = await getAnalyticsSummary();
    res.json({ success: true, summary });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve analytics summary.' });
  }
});

// Only listen locally if run directly (node server/server.js)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`G&J Solutions Backend running on http://localhost:${PORT}`);
  });
}

export default app;
