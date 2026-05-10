# FluxGuard — API Protection Layer

> Stop attacks before they reach your API. 9-layer security middleware — one endpoint, zero friction, under 5ms.

🌐 **[flux-guard.vercel.app](https://flux-guard.vercel.app)**

---

## How It Works

Your backend calls FluxGuard's `/check` endpoint **before** processing any request. FluxGuard inspects it across 9 security layers and returns a simple decision:

```json
{ "status": true }   // ✅ allow
{ "status": false }  // ❌ block — return 403
```

That's the entire integration.

---

## 9 Security Layers

| # | Layer | Trigger |
|---|-------|---------|
| 01 | API Key Validation | Invalid or missing key |
| 02 | IP Block Check | Previously blocked IP |
| 03 | User-Agent Inspection | sqlmap, nikto, nmap, headless browsers, 20+ signatures |
| 04 | Payload Inspection | SQLi, XSS, path traversal, command injection |
| 05 | Geo-Blocking | Configured country ISO codes |
| 06 | Strict Rate Limit | Auth endpoints — 10 req/min hard cap |
| 07 | Global Rate Limit | 60 req/min per IP — excess triggers auto-block |
| 08 | Error Rate Detection | Too many 4xx in 5 min → auto-block |
| 09 | Endpoint Hammering | Same endpoint hit excessively in 1 min |

Any triggered layer **instantly** blocks the IP. Manage blocked IPs from the dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS, Zustand |
| Backend | Java Spring Boot |
| Database | PostgreSQL via Supabase |
| Cache / Rate Limiting | Redis via Upstash |
| Frontend Deploy | Vercel |
| Backend Deploy | Render (Docker) |

---

## Quick Start

```bash
# 1. Register at flux-guard.vercel.app
# 2. Create an app → copy your API key
# 3. Call the check endpoint before your protected routes
# 4. Allow or block based on the response
```

```http
POST https://your-backend/api/fluxguard/security/check

{
  "apiKey":      "FG-xxxx-xxxx",
  "ipAddress":   "203.0.113.42",
  "endpoint":    "/api/users",
  "method":      "GET",
  "createdAt":   "2025-01-15T10:30:00",
  "userAgent":   "Mozilla/5.0 ...",
  "queryString": "?id=1"
}
```

---

## Self-Hosting (Docker)

A `Dockerfile` is included for the backend. Set these environment variables on your host:

```env
DATABASE_URL=your_supabase_postgres_url
REDIS_URL=your_upstash_redis_url
JWT_SECRET=your_secret
```

Then deploy to any container platform (Render, Railway, Fly.io, etc.).

---

## 📖 Full Docs & Integration Examples

Node.js, Spring Boot, and Python integration examples, full API reference, and live demo at:

**[flux-guard.vercel.app/docs](https://flux-guard.vercel.app/docs)**
