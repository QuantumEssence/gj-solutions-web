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
  getAnalyticsSummary
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to hash IP address for privacy while tracking unique visitors
function getClientIpHash(req) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  return crypto.createHash('sha256').update(String(ip)).digest('hex').substring(0, 16);
}

// Middleware to verify administrative authorization token
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const expectedToken = 'gj-admin-session-token';

  if (token && token === expectedToken) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized: Administrative access token required.'
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'G&J Solutions API', timestamp: new Date().toISOString() });
});

// Submit contact questionnaire
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, isSPMC, serviceInterest, scheduleMeeting } = req.body;

    if (!name || !email || !isSPMC || !serviceInterest || !scheduleMeeting) {
      return res.status(400).json({
        error: 'Missing required questionnaire fields (name, email, isSPMC, serviceInterest, scheduleMeeting).'
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
    const prohibitedKeywords = ['patient', 'diagnosis', 'medical record', 'prescription', 'medication', 'phi'];
    const detectedKeyword = prohibitedKeywords.find(kw => combinedContent.includes(kw));
    if (detectedKeyword) {
      return res.status(400).json({
        error: 'Strict Data Privacy Restriction: Inquiries must not contain patient health information or medical records.'
      });
    }

    const inquiry = await createInquiry({
      name: name.trim(),
      email: email.trim(),
      isSPMC,
      serviceInterest,
      scheduleMeeting
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

// Admin authentication gate endpoint
app.post('/api/admin/login', (req, res) => {
  const { password, passcode } = req.body;
  const adminSecret = process.env.ADMIN_PASSWORD || 'admin123';
  const provided = (password || passcode || '').trim();

  // Accept configured secret, standard admin passcode, or client preset
  if (provided === adminSecret || provided === 'admin' || provided === 'gj2026') {
    return res.json({
      success: true,
      token: 'gj-admin-session-token',
      message: 'Admin access authorized.'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrative passcode. Please try again (Default: admin123).'
  });
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
    const { status } = req.body;

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

// Track page view for traffic analytics
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { path: pagePath = '/' } = req.body;
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
