const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const REG_FILE = path.join(__dirname, 'registrations.json');
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.VITE_WEBHOOK_SECRET || null;

const app = express();
app.use(cors());

// Keep raw body for signature verification
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// Simple in-memory rate limiting (per IP)
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 120;
const ipCounters = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipCounters.get(ip) || { count: 0, start: now };
  if (now - entry.start > rateLimitWindowMs) {
    entry.count = 1;
    entry.start = now;
    ipCounters.set(ip, entry);
    return false;
  }
  entry.count += 1;
  ipCounters.set(ip, entry);
  return entry.count > maxRequestsPerWindow;
}

function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
}

function verifySignature(req) {
  if (!WEBHOOK_SECRET) return true; // If no secret configured, skip verification (not recommended)

  const headerCandidates = [
    'x-webhook-signature',
    'x-webconnex-signature',
    'x-signature',
    'x-hub-signature-256',
    'x-hub-signature'
  ];

  const sigHeader = headerCandidates.map(h => req.headers[h]).find(Boolean);
  if (!sigHeader) return false;

  // Some services prefix signatures with algo= (eg. sha256=...), strip if present
  const cleaned = sigHeader.includes('=') ? sigHeader.split('=')[1] : sigHeader;
  const computed = crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.rawBody).digest('hex');
  return safeCompare(computed, cleaned);
}

function ensureRegFile() {
  if (!fs.existsSync(REG_FILE)) {
    fs.writeFileSync(REG_FILE, JSON.stringify([], null, 2));
  }
}

app.post('/api/webhooks', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  // Optional timestamp check (if sender provides one)
  const timestampHeader = req.headers['x-webhook-timestamp'] || req.headers['x-timestamp'];
  if (timestampHeader) {
    const ts = Number(timestampHeader);
    if (!Number.isNaN(ts)) {
      const age = Math.abs(Date.now() - ts);
      if (age > 5 * 60 * 1000) {
        return res.status(400).json({ error: 'expired_timestamp' });
      }
    }
  }

  if (!verifySignature(req)) {
    return res.status(401).json({ error: 'invalid_signature' });
  }

  const payload = req.body;
  const entry = {
    receivedAt: new Date().toISOString(),
    ip,
    payload
  };

  try {
    ensureRegFile();
    const raw = fs.readFileSync(REG_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.unshift(entry);
    // Keep only most recent 1000 entries to avoid unbounded growth
    const limited = arr.slice(0, 1000);
    fs.writeFileSync(REG_FILE, JSON.stringify(limited, null, 2));
  } catch (err) {
    console.error('failed to persist registration', err);
    return res.status(500).json({ error: 'persist_failed' });
  }

  // Respond quickly
  res.status(200).json({ ok: true });
});

// Simple read endpoint for the dashboard to fetch recent registrations
app.get('/api/registrations', (req, res) => {
  try {
    ensureRegFile();
    const raw = fs.readFileSync(REG_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    res.json(arr.slice(0, 200));
  } catch (err) {
    console.error('failed to read registrations', err);
    res.status(500).json({ error: 'read_failed' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true, now: Date.now() }));

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
  if (!WEBHOOK_SECRET) console.warn('WARNING: WEBHOOK_SECRET not set — signature verification disabled');
});
