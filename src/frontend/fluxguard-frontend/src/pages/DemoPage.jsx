import { useState, useRef } from "react";
import { Zap, Send, ShieldCheck, ShieldOff, Loader, AlertTriangle } from "lucide-react";
import api from "../lib/api";

function useSessionIp() {
    const ref = useRef(`203.0.113.${Math.floor(Math.random() * 254) + 1}`);
    return ref.current;
}

const UA_PRESETS = [
    { label: "Chrome (normal)",  value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" },
    { label: "sqlmap (scanner)", value: "sqlmap/1.7.8#stable (https://sqlmap.org)" },
    { label: "Nikto (scanner)",  value: "Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)" },
    { label: "Empty UA (bot)",   value: "" },
    { label: "HeadlessChrome",   value: "Mozilla/5.0 HeadlessChrome/120.0.0.0 Safari/537.36" },
];

const QS_PRESETS = [
    { label: "Clean",             value: "" },
    { label: "SQLi — OR 1=1",    value: "id=1' OR '1'='1" },
    { label: "SQLi — UNION",     value: "q=1 UNION SELECT username,password FROM users" },
    { label: "XSS",              value: "search=<script>alert(1)</script>" },
    { label: "Path traversal",   value: "file=../../etc/passwd" },
    { label: "Command inject",   value: "cmd=ls;cat /etc/passwd" },
];

export default function DemoPage() {
    const [apiKey, setApiKey]       = useState("");
    const [endpoint, setEndpoint]   = useState("/api/test");
    const [method, setMethod]       = useState("GET");
    const [userAgent, setUserAgent] = useState(UA_PRESETS[0].value);
    const [queryStr, setQueryStr]   = useState("");
    const [results, setResults]     = useState([]);
    const [loading, setLoading]     = useState(false);
    const [spamming, setSpamming]   = useState(false);
    const [spamCount, setSpamCount] = useState(0);
    const sessionIp = useSessionIp();

    const buildPayload = () => ({
        apiKey,
        ipAddress:      sessionIp,
        endpoint,
        method,
        createdAt:      new Date().toISOString(),
        responseStatus: 200,
        userAgent,
        queryString:    queryStr || null,
    });

    const sendRequest = async (silent = false) => {
        if (!apiKey) return;
        if (!silent) setLoading(true);
        try {
            const res = await api.post("/api/fluxguard/security/check", buildPayload());
            addResult(true, res.data.message);
        } catch (err) {
            addResult(false, err.response?.data?.message || "Request blocked");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const addResult = (allowed, message) => {
        setResults((prev) => [{
            id: Date.now() + Math.random(),
            allowed, message,
            time: new Date().toLocaleTimeString(),
        }, ...prev].slice(0, 30));
    };

    const spamRequests = async () => {
        if (!apiKey || spamming) return;
        setSpamming(true);
        setSpamCount(0);
        for (let i = 0; i < 15; i++) {
            await sendRequest(true);
            setSpamCount(i + 1);
            await new Promise((r) => setTimeout(r, 150));
        }
        setSpamming(false);
    };

    const allowed = results.filter((r) => r.allowed).length;
    const blocked = results.filter((r) => !r.allowed).length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-xl font-700 text-text flex items-center gap-2">
                    <Zap size={18} className="text-accent" /> Live Demo
                </h1>
                <p className="text-subtle text-xs mt-1">
                    Session IP: <span className="font-mono text-accent">{sessionIp}</span> — fixed per session so spam triggers rate-limiting.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                    <div className="bg-surface border border-border rounded-lg p-5">
                        <h2 className="text-xs text-subtle uppercase tracking-wider mb-4">Request Config</h2>
                        <div className="space-y-3">

                            <div>
                                <label className="text-xs text-subtle block mb-1.5">API Key</label>
                                <input
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full bg-bg border border-border rounded px-3 py-2 text-xs text-accent font-mono placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors"
                                    placeholder="FG-xxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-subtle block mb-1.5">Endpoint</label>
                                <input
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    className="w-full bg-bg border border-border rounded px-3 py-2 text-xs text-text font-mono placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-subtle block mb-1.5">Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full bg-bg border border-border rounded px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent/50 transition-colors"
                                >
                                    {["GET","POST","PUT","DELETE","PATCH"].map((m) => <option key={m}>{m}</option>)}
                                </select>
                            </div>

                            {/* User-Agent */}
                            <div>
                                <label className="text-xs text-subtle block mb-1.5">
                                    User-Agent <span className="text-accent/60">(UA inspection)</span>
                                </label>
                                <select
                                    value={userAgent}
                                    onChange={(e) => setUserAgent(e.target.value)}
                                    className="w-full bg-bg border border-border rounded px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent/50 transition-colors mb-1.5"
                                >
                                    {UA_PRESETS.map((p) => <option key={p.label} value={p.value}>{p.label}</option>)}
                                </select>
                                {(userAgent.toLowerCase().includes("sqlmap") ||
                                    userAgent.toLowerCase().includes("nikto") ||
                                    userAgent === "") && (
                                    <p className="text-[10px] text-danger flex items-center gap-1">
                                        <AlertTriangle size={10} /> This UA will be blocked
                                    </p>
                                )}
                            </div>

                            {/* Query string */}
                            <div>
                                <label className="text-xs text-subtle block mb-1.5">
                                    Query String <span className="text-accent/60">(injection detection)</span>
                                </label>
                                <select
                                    onChange={(e) => setQueryStr(e.target.value)}
                                    className="w-full bg-bg border border-border rounded px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent/50 transition-colors mb-1.5"
                                >
                                    {QS_PRESETS.map((p) => <option key={p.label} value={p.value}>{p.label}</option>)}
                                </select>
                                {queryStr && (
                                    <p className="text-[10px] text-warning flex items-center gap-1">
                                        <AlertTriangle size={10} /> Sending: <span className="font-mono truncate">{queryStr}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={() => sendRequest()}
                                disabled={!apiKey || loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-accent text-bg text-xs font-600 py-2 rounded hover:bg-accent-dim transition-colors disabled:opacity-40"
                            >
                                {loading ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
                                Send
                            </button>
                            <button
                                onClick={spamRequests}
                                disabled={!apiKey || spamming}
                                className="flex-1 flex items-center justify-center gap-2 border border-warning/30 text-warning text-xs py-2 rounded hover:bg-warning/10 transition-colors disabled:opacity-40"
                            >
                                {spamming ? <Loader size={12} className="animate-spin" /> : <Zap size={12} />}
                                Spam ×15 {spamming && `(${spamCount}/15)`}
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-surface border border-border rounded-lg p-5">
                        <h2 className="text-xs text-subtle uppercase tracking-wider mb-3">Session Stats</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-bg border border-border rounded p-3 text-center">
                                <p className="text-lg font-display font-700 text-accent">{allowed}</p>
                                <p className="text-[10px] text-subtle mt-0.5">Allowed</p>
                            </div>
                            <div className="bg-bg border border-border rounded p-3 text-center">
                                <p className="text-lg font-display font-700 text-danger">{blocked}</p>
                                <p className="text-[10px] text-subtle mt-0.5">Blocked</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results feed */}
                <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <span className="text-xs text-subtle uppercase tracking-wider">Response Feed</span>
                        {results.length > 0 && (
                            <button onClick={() => setResults([])} className="text-[10px] text-subtle hover:text-text">Clear</button>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto max-h-[600px]">
                        {results.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-subtle text-xs">
                                Send a request to see results
                            </div>
                        ) : results.map((r) => (
                            <div key={r.id} className="flex items-start gap-3 px-4 py-3 border-b border-border/50 animate-fade-in">
                                {r.allowed
                                    ? <ShieldCheck size={14} className="text-accent mt-0.5 shrink-0" />
                                    : <ShieldOff   size={14} className="text-danger mt-0.5 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-600 ${r.allowed ? "text-accent" : "text-danger"}`}>
                                        {r.allowed ? "ALLOWED" : "BLOCKED"}
                                    </p>
                                    <p className="text-[10px] text-subtle truncate">{r.message}</p>
                                </div>
                                <span className="text-[10px] text-subtle shrink-0">{r.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}