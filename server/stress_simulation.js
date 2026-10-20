// Automated Stress Test & Failure-Mode Simulation for G&J Solutions API

const BASE_URL = 'http://localhost:5000';

async function runStressTest() {
  console.log('====================================================');
  console.log('⚡ STARTING SIMULATED STRESS & SECURITY TEST SUITE');
  console.log('====================================================\n');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  function logPass(testName, info = '') {
    results.passed++;
    console.log(`✅ [PASS] ${testName} ${info}`);
    results.details.push({ testName, status: 'PASS', info });
  }

  function logFail(testName, reason) {
    results.failed++;
    console.log(`❌ [FAIL] ${testName}: ${reason}`);
    results.details.push({ testName, status: 'FAIL', reason });
  }

  function logWarn(testName, warning) {
    results.warnings++;
    console.log(`⚠️ [WARN] ${testName}: ${warning}`);
    results.details.push({ testName, status: 'WARN', warning });
  }

  // 1. Health check baseline
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (res.ok) {
      const data = await res.json();
      logPass('Baseline Health Check', `Status: ${data.status}`);
    } else {
      logFail('Baseline Health Check', `HTTP ${res.status}`);
    }
  } catch (err) {
    logFail('Baseline Health Check', err.message);
  }

  // 2. High Concurrency Burst (50 parallel page-view track requests)
  try {
    const start = Date.now();
    const burstPromises = Array.from({ length: 50 }, (_, i) =>
      fetch(`${BASE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: i % 2 === 0 ? '/contact' : '/services' })
      })
    );
    const responses = await Promise.all(burstPromises);
    const duration = Date.now() - start;
    const okCount = responses.filter(r => r.ok).length;

    if (okCount === 50) {
      logPass('50 Concurrent Analytics Tracking Bursts', `Completed in ${duration}ms (100% OK)`);
    } else {
      logWarn('50 Concurrent Analytics Tracking Bursts', `${okCount}/50 OK in ${duration}ms`);
    }
  } catch (err) {
    logFail('Concurrent Burst Test', err.message);
  }

  // 3. MOA Data Privacy Boundary / PHI Keyword Injection Tests
  const prohibitedPayloads = [
    { name: 'Dr. Jane Smith', email: 'jane@clinic.au', isSPMC: 'Yes', serviceInterest: 'Desk Work only', scheduleMeeting: 'patient details attached to note', label: 'patient' },
    { name: 'John Doe', email: 'john@medical.au', isSPMC: 'No', serviceInterest: 'Diagnosis report preparation', scheduleMeeting: 'Yes', label: 'diagnosis' },
    { name: 'Dr. Prescription', email: 'rx@health.au', isSPMC: 'Yes', serviceInterest: 'Desk Work', scheduleMeeting: 'No', label: 'prescription' },
    { name: 'PHI Admin', email: 'phi@clinic.au', isSPMC: 'Yes', serviceInterest: 'Medical record scanning', scheduleMeeting: 'No', label: 'medical record' }
  ];

  for (const p of prohibitedPayloads) {
    try {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (res.status === 400 && data.error?.includes('Strict Data Privacy Restriction')) {
        logPass(`PHI Block: "${p.label}"`, 'Successfully rejected with 400 Compliance Error');
      } else {
        logFail(`PHI Block: "${p.label}"`, `Expected 400 rejection, received HTTP ${res.status}`);
      }
    } catch (err) {
      logFail(`PHI Block: "${p.label}"`, err.message);
    }
  }

  // 4. Input Boundary & Fuzzing Tests (Missing fields, empty body, huge payload)
  try {
    // 4a. Missing mandatory fields
    const resEmpty = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' })
    });
    if (resEmpty.status === 400) {
      logPass('Input Validation: Missing fields', 'Rejected with 400 Bad Request');
    } else {
      logFail('Input Validation: Missing fields', `Received HTTP ${resEmpty.status}`);
    }

    // 4b. 50,000 character string flood (Memory / Buffer stress)
    const giantString = 'A'.repeat(50000);
    const resHuge = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: giantString,
        email: 'test@clinic.au',
        isSPMC: 'No',
        serviceInterest: 'Desk Work only',
        scheduleMeeting: 'No'
      })
    });
    if (resHuge.status === 400) {
      logPass('Input Length Limit Check (50,000 char field)', 'Safely rejected with 400 Bad Request');
    } else {
      logWarn('Input Length Limit Check (50,000 char field)', `Server responded with HTTP ${resHuge.status}`);
    }
  } catch (err) {
    logFail('Input Boundary Stress', err.message);
  }

  // 5. Admin Authentication & Route Protection Audit
  try {
    // 5a. Admin login with correct password
    const resLogin = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'admin123' })
    });
    const loginData = await resLogin.json();
    if (resLogin.ok && loginData.success) {
      logPass('Admin Passcode Authentication', `Authorized with token: ${loginData.token}`);
    } else {
      logFail('Admin Passcode Authentication', 'Failed to authenticate');
    }

    // 5b. Admin login with wrong password
    const resBadLogin = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'wrongpassword' })
    });
    if (resBadLogin.status === 401) {
      logPass('Admin Passcode Rejection (Invalid Passcode)', 'Rejected with 401 Unauthorized');
    } else {
      logFail('Admin Passcode Rejection', `Expected 401, got ${resBadLogin.status}`);
    }

    // 5c. Backend Route Protection Check: Can unauthenticated requests modify inquiries?
    const unauthDelete = await fetch(`${BASE_URL}/api/inquiries/9999`, {
      method: 'DELETE'
      // No Authorization header provided!
    });

    if (unauthDelete.status === 401 || unauthDelete.status === 403) {
      logPass('Admin REST Protection (Unauthenticated DELETE blocked)', `Blocked with HTTP ${unauthDelete.status}`);
    } else {
      logWarn('Admin REST Protection (Unauthenticated DELETE allowed)', 
        `HTTP ${unauthDelete.status}: Endpoint accepted unauthenticated request without Bearer token! (Missing backend auth middleware).`);
    }
  } catch (err) {
    logFail('Admin Auth Audit', err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 TEST SUMMARY: ${results.passed} PASSED | ${results.failed} FAILED | ${results.warnings} WARNINGS`);
  console.log('====================================================');
}

runStressTest();
