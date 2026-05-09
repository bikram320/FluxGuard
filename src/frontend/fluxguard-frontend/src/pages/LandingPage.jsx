import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";


const layers = [
    { num: "01", name: "API Key Validation",   color: "text-accent",   desc: "Rejects requests with invalid or missing API keys instantly." },
    { num: "02", name: "IP Block Check",        color: "text-accent",   desc: "Instantly drops requests from previously blocked IPs." },
    { num: "03", name: "User-Agent Inspection", color: "text-warning",  desc: "Detects sqlmap, nikto, nmap, headless browsers, and 20+ scanner signatures." },
    { num: "04", name: "Payload Inspection",    color: "text-warning",  desc: "Scans for SQLi, XSS, path traversal, and command injection patterns." },
    { num: "05", name: "Geo-Blocking",          color: "text-warning",  desc: "Blocks requests from configured countries by ISO code." },
    { num: "06", name: "Strict Rate Limit",     color: "text-danger",   desc: "Auth endpoints hard-limited to 10 req/min. No exceptions." },
    { num: "07", name: "Global Rate Limit",     color: "text-danger",   desc: "60 req/min per IP per API key. Excess triggers auto-block." },
    { num: "08", name: "Error Rate Detection",  color: "text-danger",   desc: "Too many 4xx in 5 min indicates scanning. Auto-blocks offender." },
    { num: "09", name: "Endpoint Hammering",    color: "text-danger",   desc: "Detects excessive hits on the same endpoint in 1 min." },
];

const steps = [
    {
        n: "1",
        title: "Create an app",
        desc: "Register, go to Applications, and create a new app. Copy your generated API key.",
    },
    {
        n: "2",
        title: "Call the check endpoint",
        desc: (
            <>
                Before every protected route, POST to{" "}
                <span className="font-mono text-accent text-[11px]">/api/fluxguard/security/check</span>{" "}
                with the caller's IP and your API key.
            </>
        ),
    },
    {
        n: "3",
        title: "Handle the response",
        desc: (
            <>
                <span className="font-mono text-accent">status: true</span> → allow.{" "}
                <span className="font-mono text-danger">status: false</span> → return 403. That's it.
            </>
        ),
    },
];

const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg text-text font-display" style={{ scrollBehavior: "smooth" }}>

            {/* Nav */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 border-b border-border bg-bg/90 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 border border-accent/30 bg-accent/5 rounded-md flex items-center justify-center">
                        <Shield size={16} className="text-accent" />
                    </div>
                    <span className="font-display font-700 text-sm tracking-widest uppercase">FluxGuard</span>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => scrollTo("features")} className="font-mono text-[12px] text-subtle hover:text-text transition-colors">Features</button>
                    <button onClick={() => scrollTo("how")}      className="font-mono text-[12px] text-subtle hover:text-text transition-colors">How it works</button>
                    <Link to="/docs"    className="font-mono text-[12px] text-subtle hover:text-text transition-colors">Docs</Link>
                    <Link
                        to="/login"
                        className="font-mono text-[12px] font-600 bg-accent text-bg px-4 py-2 rounded-md hover:bg-accent-dim transition-colors"
                    >
                        Sign in →
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="grid-bg">
                <div className="max-w-3xl mx-auto px-10 pt-24 pb-20 text-center animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-3.5 py-1.5 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="font-mono text-[11px] text-accent">9-layer API security middleware</span>
                    </div>

                    <h1 className="font-display font-800 text-5xl leading-[1.1] mb-5">
                        Stop attacks<br />before they<br />
                        <span className="text-accent">reach your API</span>
                    </h1>
                    <p className="text-subtle text-[15px] leading-relaxed max-w-lg mx-auto mb-10">
                        FluxGuard sits in front of your backend and blocks threats in real time — rate limiting,
                        IP blocking, scanner detection, injection prevention, and more. One endpoint. Zero friction.
                    </p>

                    <div className="flex gap-3 justify-center flex-wrap">
                        <Link to="/register" className="font-mono text-[13px] font-600 bg-accent text-bg px-6 py-3 rounded-md hover:bg-accent-dim transition-colors inline-flex items-center gap-2">
                            Get started free <ArrowRight size={14} />
                        </Link>
                        <Link to="/docs" className="font-mono text-[13px] font-600 border border-border text-text px-6 py-3 rounded-md hover:border-subtle transition-colors inline-flex items-center gap-2">
                            View docs
                        </Link>
                    </div>
                </div>

                {/* Code preview */}
                <div className="max-w-xl mx-auto px-10 pb-20">
                    <div className="bg-surface border border-border rounded-xl overflow-hidden text-left">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                            <span className="font-mono text-[10px] text-subtle ml-auto uppercase tracking-widest">security check response</span>
                        </div>
                        <div className="p-5 font-mono text-[12px] leading-[1.8]">
                            <span className="text-border">{"// POST /api/fluxguard/security/check"}</span><br />
                            <span className="text-text">{"{"}</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"apiKey"</span><span className="text-text">: </span><span className="text-accent">"FG-1234-AbCd"</span><span className="text-text">,</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"ipAddress"</span><span className="text-text">: </span><span className="text-accent">"203.0.113.42"</span><span className="text-text">,</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"userAgent"</span><span className="text-text">: </span><span className="text-accent">"sqlmap/1.7"</span><span className="text-text">,</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"endpoint"</span><span className="text-text">: </span><span className="text-accent">"/api/users"</span><br />
                            <span className="text-text">{"}"}</span><br /><br />
                            <span className="text-border">{"// ← response in <5ms"}</span><br />
                            <span className="text-text">{"{"}</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"status"</span><span className="text-text">: </span><span className="text-danger">false</span><span className="text-text">,</span><br />
                            <span className="text-subtle">&nbsp;&nbsp;"message"</span><span className="text-text">: </span><span className="text-danger">"Known scanner detected: sqlmap"</span><br />
                            <span className="text-text">{"}"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border mx-10" />

            {/* Features */}
            <section id="features" className="max-w-5xl mx-auto px-10 py-20">
                <p className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] mb-3">Protection layers</p>
                <h2 className="font-display font-800 text-3xl mb-3">9 layers of security,<br />zero config required</h2>
                <p className="text-subtle text-sm leading-relaxed max-w-md mb-10">
                    Every request is checked against all 9 layers simultaneously. Any triggered check auto-blocks the IP immediately.
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {layers.map(({ num, name, color, desc }) => (
                        <div key={num} className="bg-surface border border-border rounded-lg p-4">
                            <p className="font-mono text-[10px] text-border font-700 mb-2">{num}</p>
                            <p className={`text-[13px] font-600 mb-1 ${color}`}>{name}</p>
                            <p className="text-[11px] text-subtle leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-border mx-10" />

            {/* How it works */}
            <section id="how" className="max-w-5xl mx-auto px-10 py-20">
                <p className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] mb-3">How it works</p>
                <h2 className="font-display font-800 text-3xl mb-3">Integrate in minutes,<br />protect forever</h2>
                <p className="text-subtle text-sm leading-relaxed max-w-md mb-10">
                    FluxGuard works as a middleware layer — call one endpoint before your protected routes and let us handle the rest.
                </p>

                <div className="grid grid-cols-3 gap-5">
                    {steps.map(({ n, title, desc }) => (
                        <div key={n} className="bg-surface border border-border rounded-lg p-5">
                            <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-[11px] font-700 text-accent mb-3">
                                {n}
                            </div>
                            <p className="text-[13px] font-700 text-text mb-1.5">{title}</p>
                            <p className="text-[12px] text-subtle leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-border mx-10" />

            {/* CTA */}
            <section className="px-10 py-20 text-center">
                <div className="bg-surface border border-accent/20 rounded-xl px-10 py-16 max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-3.5 py-1.5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse2" />
                        <span className="font-mono text-[11px] text-accent">Free to get started</span>
                    </div>
                    <h2 className="font-display font-800 text-3xl mb-3">Your API deserves<br />real protection</h2>
                    <p className="text-subtle text-sm mb-8">
                        Join developers who trust FluxGuard to block attacks before they reach their backend.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <Link to="/register" className="font-mono text-[13px] font-600 bg-accent text-bg px-6 py-3 rounded-md hover:bg-accent-dim transition-colors inline-flex items-center gap-2">
                            Create free account <ArrowRight size={14} />
                        </Link>
                        <Link to="/docs" className="font-mono text-[13px] font-600 border border-border text-text px-6 py-3 rounded-md hover:border-subtle transition-colors">
                            Read the docs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-10 py-6 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[11px] text-subtle uppercase tracking-[0.1em]">FluxGuard — API Protection Layer</span>
                <span className="font-mono text-[11px] text-border">© 2026 FluxGuard</span>
            </footer>
        </div>
    );
}