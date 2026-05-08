import { useState, useEffect } from "react";
import { Ban, Unlock, Loader, AlertTriangle } from "lucide-react";
import api from "../lib/api";

export default function BlocksPage() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unblocking, setUnblocking] = useState(null);

    const fetchBlocks = async () => {
        try {
            const res = await api.get("/api/dashboard/blocks");
            setBlocks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (block) => {
        setUnblocking(block.id);
        try {
            await api.post("/api/dashboard/blocks/unblock", {
                ip: block.ip,
                apiKey: null,
            });
            await fetchBlocks();
        } catch (err) {
            console.error(err);
        } finally {
            setUnblocking(null);
        }
    };

    useEffect(() => { fetchBlocks(); }, []);

    const isExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();
    const isPermanent = (expiresAt) => !expiresAt;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-xl font-700 text-text">Blocked IPs</h1>
                    <p className="text-subtle text-xs mt-1">
                        {blocks.length} active block{blocks.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-subtle border border-border rounded px-3 py-1.5">
                    <Ban size={12} className="text-danger" />
                    Auto-blocking enabled
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-subtle text-xs">
                    <Loader size={16} className="animate-spin mr-2" /> Loading...
                </div>
            ) : blocks.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg py-20 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/5 border border-accent/20 mb-3">
                        <Ban size={16} className="text-accent" />
                    </div>
                    <p className="text-subtle text-sm">No blocked IPs</p>
                    <p className="text-subtle/60 text-xs mt-1">IPs get auto-blocked when they violate rate limits</p>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-5 px-4 py-2.5 border-b border-border">
                        {["IP Address", "App", "Reason", "Expires", "Action"].map((h) => (
                            <span key={h} className="text-[10px] text-subtle uppercase tracking-wider font-600">{h}</span>
                        ))}
                    </div>

                    {blocks.map((block, i) => (
                        <div
                            key={block.id}
                            className="grid grid-cols-5 px-4 py-3.5 border-b border-border/50 hover:bg-muted/30 transition-colors items-center animate-fade-in"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse2 shrink-0" />
                                <span className="text-xs text-text font-mono">{block.ip}</span>
                            </div>

                            <span className="text-xs text-subtle truncate pr-2">{block.appName}</span>

                            <div className="flex items-center gap-1.5 pr-2">
                                <AlertTriangle size={10} className="text-warning shrink-0" />
                                <span className="text-xs text-subtle truncate">{block.reason || "—"}</span>
                            </div>

                            <span className="text-xs">
                {isPermanent(block.expiresAt) ? (
                    <span className="text-danger">Permanent</span>
                ) : isExpired(block.expiresAt) ? (
                    <span className="text-subtle line-through">Expired</span>
                ) : (
                    <span className="text-warning">
                    {new Date(block.expiresAt).toLocaleString()}
                  </span>
                )}
              </span>

                            <button
                                onClick={() => handleUnblock(block)}
                                disabled={unblocking === block.id}
                                className="flex items-center gap-1.5 text-xs text-subtle hover:text-accent border border-border hover:border-accent/30 rounded px-2.5 py-1 transition-all disabled:opacity-40 w-fit"
                            >
                                {unblocking === block.id ? (
                                    <Loader size={11} className="animate-spin" />
                                ) : (
                                    <Unlock size={11} />
                                )}
                                Unblock
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}