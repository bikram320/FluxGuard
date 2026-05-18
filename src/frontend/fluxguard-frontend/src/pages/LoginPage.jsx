import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const setLoggedIn = useAuthStore((s) => s.setLoggedIn);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/users/login", form);
            setLoggedIn();
            navigate("/apps");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg grid-bg flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm animate-slide-up">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded border border-accent/30 bg-accent/5 mb-4 hover:bg-accent/10 transition-colors">
                        <Shield size={20} className="text-accent" />
                    </Link>
                    <h1 className="font-display text-2xl font-800 text-text">FluxGuard</h1>
                    <p className="text-subtle text-xs mt-1">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-subtle block mb-1.5">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-subtle block mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text p-1"
                            >
                                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-danger text-xs bg-danger/10 border border-danger/20 rounded px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-bg font-mono font-600 text-sm py-2.5 rounded hover:bg-accent-dim transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : <>Sign in <ArrowRight size={14} /></>}
                    </button>
                </form>

                <p className="text-center text-xs text-subtle mt-6">
                    No account?{" "}
                    <Link to="/register" className="text-accent hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}