import { useState } from "react";
import { BookOpen, Copy, Check, ChevronDown, ChevronRight, Shield, Zap, Code, Terminal } from "lucide-react";

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} className="text-subtle hover:text-accent transition-colors p-1">
            {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
        </button>
    );
}

function CodeBlock({ code, lang = "bash" }) {
    return (
        <div className="bg-bg border border-border rounded-lg overflow-hidden mt-3">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-[10px] text-subtle font-mono uppercase">{lang}</span>
                <CopyButton text={code} />
            </div>
            <pre className="px-4 py-3 text-xs font-mono text-text overflow-auto leading-relaxed whitespace-pre">
                {code}
            </pre>
        </div>
    );
}

function Section({ icon: Icon, title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 md:px-5 py-4 hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon size={15} className="text-accent shrink-0" />
                    <span className="font-display font-600 text-sm text-text text-left">{title}</span>
                </div>
                {open
                    ? <ChevronDown  size={14} className="text-subtle shrink-0" />
                    : <ChevronRight size={14} className="text-subtle shrink-0" />}
            </button>
            {open && (
                <div className="px-4 md:px-5 pb-5 space-y-4 border-t border-border">
                    {children}
                </div>
            )}
        </div>
    );
}

function Step({ n, title, children }) {
    return (
        <div className="flex gap-3 md:gap-4">
            <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-700 text-accent">{n}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-text mb-1">{title}</p>
                <div className="text-xs text-subtle leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CHECKS = [
    { name: "API Key Validation",    color: "text-accent",  desc: "Rejects requests with invalid or missing API keys immediately." },
    { name: "IP Block Check",        color: "text-accent",  desc: "Instantly drops requests from previously blocked IPs." },
    { name: "User-Agent Inspection", color: "text-warning", desc: "Detects sqlmap, nikto, nmap, headless browsers, and 20+ scanner signatures." },
    { name: "Payload Inspection",    color: "text-warning", desc: "Scans query strings for SQLi, XSS, path traversal, and command injection patterns." },
    { name: "Geo-Blocking",          color: "text-warning", desc: "Blocks requests from configured countries (ISO codes). Disabled by default." },
    { name: "Strict Rate Limit",     color: "text-danger",  desc: "Auth/sensitive endpoints (login, register, payment) — hard limit of 10 req/min." },
    { name: "Global Rate Limit",     color: "text-danger",  desc: "All endpoints — 60 requests/min per IP per API key. Excess triggers auto-block." },
    { name: "Error Rate Detection",  color: "text-danger",  desc: "Too many 4xx responses in 5 min indicates scanning. Auto-blocks the offending IP." },
    { name: "Endpoint Hammering",    color: "text-danger",  desc: "Same endpoint hit excessively in 1 min (path vars normalized). Triggers auto-block." },
];

export default function DocsPage() {
    return (
        <div>
            <div className="mb-6 md:mb-8">
                <h1 className="font-display text-xl font-700 text-text flex items-center gap-2">
                    <BookOpen size={18} className="text-accent" /> Documentation
                </h1>
                <p className="text-subtle text-xs mt-1">Everything you need to integrate FluxGuard into your application.</p>
            </div>

            {/* Base URL banner */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] text-subtle uppercase tracking-wider mb-0.5">Base URL</p>
                    <p className="text-xs font-mono text-accent truncate">{BASE_URL}</p>
                </div>
                <CopyButton text={BASE_URL} />
            </div>

            <div className="space-y-3">

                {/* Quick Start */}
                <Section icon={Zap} title="Quick Start" defaultOpen={true}>
                    <p className="text-xs text-subtle mt-4 leading-relaxed">
                        FluxGuard acts as a security middleware. Before your backend processes any request,
                        call FluxGuard's <span className="text-accent font-mono">/check</span> endpoint.
                        If blocked, return 403 to your caller — otherwise proceed normally.
                    </p>
                    <div className="space-y-5 mt-2">
                        <Step n="1" title="Register & create an app">
                            Go to <span className="text-accent">Applications</span> → click <span className="text-accent">New App</span> → copy your generated API key.
                        </Step>
                        <Step n="2" title="Call the security check endpoint">
                            Before every sensitive endpoint, POST to FluxGuard with the caller's IP, User-Agent, and your API key.
                            Optionally pass the query string for injection detection.
                        </Step>
                        <Step n="3" title="Handle the response">
                            <span className="font-mono text-accent">status: true</span> → allow.{" "}
                            <span className="font-mono text-danger">status: false</span> → return 403 immediately.
                        </Step>
                    </div>
                </Section>

                {/* Security Checks */}
                <Section icon={Shield} title="Security Checks — 9 Layers">
                    <div className="mt-4 space-y-2">
                        {CHECKS.map(({ name, color, desc }, i) => (
                            <div key={name} className="flex gap-3 bg-bg border border-border rounded p-3 items-start">
                                <span className="text-[10px] font-700 text-subtle bg-muted rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0">
                                    <p className={`text-xs font-600 ${color}`}>{name}</p>
                                    <p className="text-[11px] text-subtle mt-0.5 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 bg-accent/5 border border-accent/20 rounded p-3">
                        <p className="text-xs text-subtle">
                            <span className="text-accent font-600">Auto-blocking:</span> any triggered check instantly blocks the IP.
                            Blocks are time-limited (10–60 min depending on severity) and manageable from the{" "}
                            <span className="text-accent">Blocked IPs</span> page.
                        </p>
                    </div>
                </Section>

                {/* API Reference */}
                <Section icon={Code} title="API Reference">
                    <div className="mt-4 space-y-6">
                        <div>
                            <p className="text-[10px] text-subtle uppercase tracking-wider mb-3">Authentication</p>
                            <div className="space-y-3">
                                <div className="border border-border rounded-lg p-4">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-[10px] font-700 text-warning bg-warning/10 border border-warning/20 rounded px-1.5 py-0.5">POST</span>
                                        <span className="text-xs font-mono text-text break-all">/auth/users/register</span>
                                    </div>
                                    <p className="text-xs text-subtle mb-2">Register a new account. Returns a JWT token.</p>
                                    <CodeBlock lang="json" code={`{
  "username": "yourname",
  "email": "you@example.com",
  "password": "yourpassword",
  "confirmPassword": "yourpassword"
}`} />
                                </div>

                                <div className="border border-border rounded-lg p-4">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-[10px] font-700 text-warning bg-warning/10 border border-warning/20 rounded px-1.5 py-0.5">POST</span>
                                        <span className="text-xs font-mono text-text break-all">/auth/users/login</span>
                                    </div>
                                    <p className="text-xs text-subtle mb-2">Login and receive a JWT token.</p>
                                    <CodeBlock lang="json" code={`{
  "email": "you@example.com",
  "password": "yourpassword"
}`} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] text-subtle uppercase tracking-wider mb-3">Security Check — Core Endpoint</p>
                            <div className="border border-accent/20 rounded-lg p-4 bg-accent/5">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[10px] font-700 text-warning bg-warning/10 border border-warning/20 rounded px-1.5 py-0.5">POST</span>
                                    <span className="text-xs font-mono text-text break-all">/api/fluxguard/security/check</span>
                                    <span className="text-[10px] text-accent border border-accent/20 rounded px-1.5 py-0.5">No auth required</span>
                                </div>
                                <p className="text-xs text-subtle mb-3">
                                    Call this before every protected request. Uses your app's API key — no JWT needed.
                                </p>
                                <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Request body</p>
                                <CodeBlock lang="json" code={`{
  "apiKey":         "FG-1234-AbCd",       // required
  "ipAddress":      "203.0.113.42",        // required
  "endpoint":       "/api/products",       // required
  "method":         "GET",                 // required
  "createdAt":      "2024-01-15T10:30:00", // required
  "responseStatus": 200,                   // optional
  "userAgent":      "Mozilla/5.0 ...",     // recommended
  "queryString":    "id=1 OR 1=1"          // recommended
}`} />
                                <p className="text-[10px] text-subtle uppercase tracking-wider mb-1 mt-4">Response</p>
                                <CodeBlock lang="json" code={`{ "status": true,  "message": "Request allowed" }
{ "status": false, "message": "Rate limit exceeded" }
{ "status": false, "message": "Known scanner detected: sqlmap" }
{ "status": false, "message": "Malicious payload detected" }
{ "status": false, "message": "Access denied from this region" }`} />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Integration examples */}
                <Section icon={Terminal} title="Integration Examples">
                    <div className="mt-4 space-y-5">
                        <div>
                            <p className="text-xs font-600 text-text mb-1">Node.js / Express</p>
                            <CodeBlock lang="javascript" code={`const axios = require("axios");

async function fluxGuardCheck(req, res, next) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]
             || req.socket.remoteAddress;
  try {
    const { data } = await axios.post(
      "${BASE_URL}/api/fluxguard/security/check",
      {
        apiKey:         process.env.FLUXGUARD_API_KEY,
        ipAddress:      ip,
        endpoint:       req.path,
        method:         req.method,
        createdAt:      new Date().toISOString(),
        responseStatus: 200,
        userAgent:      req.headers["user-agent"] || "",
        queryString:    new URLSearchParams(req.query).toString(),
      },
      { timeout: 2000 }
    );
    if (!data.status) return res.status(403).json({ error: data.message });
    next();
  } catch (err) {
    next(); // fail open
  }
}
app.use("/api", fluxGuardCheck);`} />
                        </div>

                        <div>
                            <p className="text-xs font-600 text-text mb-1">Spring Boot (Java)</p>
                            <CodeBlock lang="java" code={`@Component
public class FluxGuardFilter extends OncePerRequestFilter {

    @Value("\${fluxguard.api-key}")  private String apiKey;
    @Value("\${fluxguard.base-url}") private String baseUrl;
    private final RestTemplate rest = new RestTemplate();

    @Override
    protected void doFilterInternal(
            HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {

        Map<String, Object> body = new HashMap<>();
        body.put("apiKey",         apiKey);
        body.put("ipAddress",      req.getRemoteAddr());
        body.put("endpoint",       req.getRequestURI());
        body.put("method",         req.getMethod());
        body.put("createdAt",      LocalDateTime.now().toString());
        body.put("responseStatus", 200);
        body.put("userAgent",      req.getHeader("User-Agent"));
        body.put("queryString",    req.getQueryString());

        try {
            ResponseEntity<Map> resp = rest.postForEntity(
                baseUrl + "/api/fluxguard/security/check", body, Map.class
            );
            if (Boolean.FALSE.equals(resp.getBody().get("status"))) {
                res.setStatus(HttpStatus.FORBIDDEN.value());
                return;
            }
        } catch (Exception ignored) { /* fail open */ }
        chain.doFilter(req, res);
    }
}`} />
                        </div>

                        <div>
                            <p className="text-xs font-600 text-text mb-1">Python / FastAPI</p>
                            <CodeBlock lang="python" code={`import httpx
from fastapi import Request, HTTPException, Depends
from datetime import datetime

FLUXGUARD_KEY = "FG-1234-AbCd"
FLUXGUARD_URL = "${BASE_URL}/api/fluxguard/security/check"

async def fluxguard_check(request: Request):
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.post(FLUXGUARD_URL, json={
                "apiKey":         FLUXGUARD_KEY,
                "ipAddress":      request.client.host,
                "endpoint":       request.url.path,
                "method":         request.method,
                "createdAt":      datetime.now().isoformat(),
                "responseStatus": 200,
                "userAgent":      request.headers.get("user-agent", ""),
                "queryString":    str(request.query_params),
            })
        data = resp.json()
        if not data.get("status"):
            raise HTTPException(403, detail=data.get("message"))
    except httpx.RequestError:
        pass  # fail open

@app.get("/api/data", dependencies=[Depends(fluxguard_check)])
async def get_data():
    return {"data": "protected"}`} />
                        </div>
                    </div>
                </Section>

            </div>
        </div>
    );
}