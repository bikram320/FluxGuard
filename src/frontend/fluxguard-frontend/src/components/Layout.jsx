import { NavLink, useNavigate } from "react-router-dom";
import { Shield, LayoutGrid, FileText, Ban, Zap, LogOut, BookOpen } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import clsx from "clsx";

const nav = [
    { to: "/apps",   icon: LayoutGrid, label: "Applications" },
    { to: "/blocks", icon: Ban,         label: "Blocked IPs"  },
    { to: "/demo",   icon: Zap,         label: "Live Demo"    },
    { to: "/docs",   icon: BookOpen,    label: "Docs"         },
];

export default function Layout({ children }) {
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-bg">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-border flex flex-col bg-surface">
                {/* Logo */}
                <div className="px-5 py-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-accent" />
                        <span className="font-display font-700 text-sm tracking-widest text-text uppercase">
              FluxGuard
            </span>
                    </div>
                    <p className="text-[10px] text-subtle mt-1 font-mono">API Protection Layer</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {nav.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded text-xs font-mono transition-all",
                                    isActive
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "text-subtle hover:text-text hover:bg-muted"
                                )
                            }
                        >
                            <Icon size={14} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded text-xs font-mono text-subtle hover:text-danger hover:bg-danger/10 transition-all"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto grid-bg">
                <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}