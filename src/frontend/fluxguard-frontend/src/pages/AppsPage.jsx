import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Copy, Check, FileText, Calendar, X, Loader } from "lucide-react";
import api from "../lib/api";

function ApiKeyDisplay({ apiKey }) {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const masked = apiKey.slice(0, 6) + "••••••••••••••••" + apiKey.slice(-4);

    return (
        <div className="flex items-center gap-2 bg-bg border border-border rounded px-3 py-1.5 mt-3">
            <span className="text-xs font-mono text-accent flex-1 truncate">
                {visible ? apiKey : masked}
            </span>
            <button onClick={() => setVisible(!visible)} className="text-subtle hover:text-text text-[10px] shrink-0">
                {visible ? "hide" : "show"}
            </button>
            <button onClick={copy} className="text-subtle hover:text-accent transition-colors shrink-0">
                {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
            </button>
        </div>
    );
}

function CreateAppModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ appName: "", appDescription: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/api/application/create", form);
            onCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create app");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
            <div className="bg-surface border border-border rounded-lg w-full max-w-md animate-slide-up p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-600 text-text">New Application</h2>
                    <button onClick={onClose} className="text-subtle hover:text-text p-1">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-subtle block mb-1.5">App Name</label>
                        <input
                            value={form.appName}
                            onChange={(e) => setForm({ ...form, appName: e.target.value })}
                            className="w-full bg-bg border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors"
                            placeholder="My API"
                            minLength={3}
                            maxLength={25}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-subtle block mb-1.5">Description</label>
                        <textarea
                            value={form.appDescription}
                            onChange={(e) => setForm({ ...form, appDescription: e.target.value })}
                            className="w-full bg-bg border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
                            placeholder="What does this app do?"
                            rows={3}
                            minLength={10}
                            maxLength={300}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-danger text-xs bg-danger/10 border border-danger/20 rounded px-3 py-2">{error}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-border text-subtle text-sm py-2 rounded hover:border-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-accent text-bg font-600 text-sm py-2 rounded hover:bg-accent-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader size={14} className="animate-spin" /> : "Create App"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AppsPage() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchApps = async () => {
        try {
            const res = await api.get("/api/dashboard/apps");
            setApps(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApps(); }, []);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-xl font-700 text-text">Applications</h1>
                    <p className="text-subtle text-xs mt-1">{apps.length} app{apps.length !== 1 ? "s" : ""} protected</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-accent text-bg font-mono text-xs font-600 px-3 md:px-4 py-2 rounded hover:bg-accent-dim transition-colors"
                >
                    <Plus size={14} />
                    <span className="hidden sm:inline">New App</span>
                    <span className="sm:hidden">New</span>
                </button>
            </div>

            {/* Apps list */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-subtle text-xs">
                    <Loader size={16} className="animate-spin mr-2" /> Loading...
                </div>
            ) : apps.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg py-20 text-center">
                    <p className="text-subtle text-sm">No applications yet</p>
                    <p className="text-subtle/60 text-xs mt-1">Create your first app to get an API key</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 text-accent text-xs hover:underline flex items-center gap-1 mx-auto"
                    >
                        <Plus size={12} /> Create app
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {apps.map((app, i) => (
                        <div
                            key={app.id}
                            className="bg-surface border border-border rounded-lg p-4 md:p-5 hover:border-accent/20 transition-all animate-slide-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display font-600 text-text">{app.appName}</h3>
                                    <p className="text-subtle text-xs mt-1 leading-relaxed">{app.description}</p>
                                    <ApiKeyDisplay apiKey={app.apiKey} />
                                </div>

                                {/* Actions — stacks below on xs, beside on sm+ */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="flex items-center gap-1 text-[10px] text-subtle whitespace-nowrap">
                                        <Calendar size={10} />
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        to={`/apps/${app.id}/logs`}
                                        className="flex items-center gap-1 text-xs text-subtle hover:text-accent transition-colors border border-border hover:border-accent/30 rounded px-2 py-1"
                                    >
                                        <FileText size={11} /> Logs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <CreateAppModal onClose={() => setShowModal(false)} onCreated={fetchApps} />
            )}
        </div>
    );
}