import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const setToken = useAuthStore((s) => s.setToken);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/auth/users/register", form);
            setToken(res.data);
            navigate("/apps");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const field = (key, type, placeholder, extra = {}) => (
        <div>
            <label className="text-xs text-subtle block mb-1.5 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
            <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors"
                placeholder={placeholder}
                required
                {...extra}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-bg grid-bg flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded border border-accent/30 bg-accent/5 mb-4 glow">
                        <Shield size={20} className="text-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-800 text-text">FluxGuard</h1>
                    <p className="text-subtle text-xs mt-1">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {field("username", "text", "Your name", { minLength: 3 })}
                    {field("email", "email", "you@example.com")}

                    <div>
                        <label className="text-xs text-subtle block mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors pr-10"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text"
                            >
                                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-subtle block mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPw ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-text placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text"
                            >
                                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
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
                        {loading ? "Creating account..." : <>Create account <ArrowRight size={14} /></>}
                    </button>
                </form>

                <p className="text-center text-xs text-subtle mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-accent hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}