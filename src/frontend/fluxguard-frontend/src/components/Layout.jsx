import { NavLink, useNavigate } from "react-router-dom";
import { Shield, LayoutGrid, Ban, Zap, LogOut, BookOpen } from "lucide-react";
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

            {/* ── Sidebar (md+) ── */}
            <aside className="hidden md:flex w-56 shrink-0 border-r border-border flex-col bg-surface">
                <div className="px-5 py-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-accent" />
                        <span className="font-display font-700 text-sm tracking-widest text-text uppercase">
                            FluxGuard
                        </span>
                    </div>
                    <p className="text-[10px] text-subtle mt-1 font-mono">API Protection Layer</p>
                </div>

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

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

                {/* Mobile top bar */}
                <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-accent" />
                        <span className="font-display font-700 text-xs tracking-widest text-text uppercase">FluxGuard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-[11px] font-mono text-subtle hover:text-danger transition-colors"
                    >
                        <LogOut size={13} /> Logout
                    </button>
                </header>

                <main className="flex-1 overflow-auto grid-bg pb-20 md:pb-0">
                    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Mobile bottom nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border flex items-center">
                    {nav.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                clsx(
                                    "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-mono transition-all",
                                    isActive ? "text-accent" : "text-subtle"
                                )
                            }
                        >
                            <Icon size={16} />
                            {label.split(" ")[0]}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}