# Webhook Server for Webconnex

This directory contains a small webhook server that accepts Webconnex webhook requests, verifies an optional HMAC signature, and stores received registrations to a local JSON file for use by the dashboard.

Files added
- server.js - Express server that receives /api/webhooks and exposes /api/registrations
- .env.example - example environment variables
- registrations.example.json - example file (do not use in production)
- .gitignore (in this folder) - ignores registrations.json so you don't accidentally commit real data

Quick start

1. Install dependencies

```bash
cd webhook-server
npm install express cors
```

2. Create a .env file in the `webhook-server` folder (or export env vars)

```
WEBHOOK_SECRET=your_webhook_secret_here
VITE_WEBHOOK_SERVER=http://localhost:5000
PORT=5000
```

Note: The server will accept requests even without WEBHOOK_SECRET, but signature verification will be skipped — this is not recommended for production.

3. Start the webhook server (new terminal)

```bash
node server.js
```

4. Start your dashboard (in the dashboard project root)

```bash
npm run dev
```

5. Update the dashboard environment to point to the webhook server (for local testing)

Create or update `.env` in your dashboard project root:

```
VITE_WEBHOOK_SERVER=http://localhost:5000
```

6. Configure Webconnex to send webhooks to your publicly-accessible URL

Set the webhook target in Webconnex to:

```
https://your-domain.com/api/webhooks
```

For local testing you can use ngrok:

```bash
ngrok http 5000
# then use the forwarded URL like https://abcd1234.ngrok.io/api/webhooks
```

Security notes and recommendations
- Set `WEBHOOK_SECRET` in environment variables and configure the Webconnex webhook to sign payloads with the same secret.
- The server looks for common signature headers (x-webhook-signature, x-webconnex-signature, x-signature, x-hub-signature-256) and verifies an HMAC-SHA256 of the raw body.
- The server performs a basic timestamp check when an `x-webhook-timestamp` header is present.
- A simple in-memory rate limiter is included. For production, replace with a robust store (Redis) and a more complete rate-limiting solution.
- For production persistence, replace the local JSON file with a database (Postgres/SQLite) and add migrations/backups.

How the dashboard should fetch data
- The dashboard can GET `/api/registrations` from the webhook server (proxy or CORS allowed).
- Set `VITE_WEBHOOK_SERVER` to your webhook server root (eg `https://your-domain.com`), and have the dashboard call `${import.meta.env.VITE_WEBHOOK_SERVER}/api/registrations`.

