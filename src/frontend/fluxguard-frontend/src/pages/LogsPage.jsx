import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import api from "../lib/api";

const methodColors = {
    GET: "text-accent",
    POST: "text-warning",
    PUT: "text-blue-400",
    DELETE: "text-danger",
    PATCH: "text-purple-400",
};

export default function LogsPage() {
    const { appId } = useParams();
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async (p = 0) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/dashboard/apps/${appId}/logs?page=${p}&size=20`);
            setLogs(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(p);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [appId]);

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Link to="/apps" className="text-subtle hover:text-text transition-colors">
                    <ArrowLeft size={16} />
                </Link>
                <div>
                    <h1 className="font-display text-xl font-700 text-text">Request Logs</h1>
                    <p className="text-subtle text-xs mt-1">App ID: {appId}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-subtle text-xs">
                    <Loader size={16} className="animate-spin mr-2" /> Loading logs...
                </div>
            ) : logs.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg py-20 text-center">
                    <p className="text-subtle text-sm">No requests logged yet</p>
                </div>
            ) : (
                <>
                    <div className="bg-surface border border-border rounded-lg overflow-hidden">
                        {/* Table header */}
                        <div className="grid grid-cols-4 px-4 py-2.5 border-b border-border">
                            {["IP Address", "Endpoint", "Method", "Timestamp"].map((h) => (
                                <span key={h} className="text-[10px] text-subtle uppercase tracking-wider font-600">{h}</span>
                            ))}
                        </div>

                        {/* Rows */}
                        {logs.map((log, i) => (
                            <div
                                key={log.id}
                                className="grid grid-cols-4 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                                style={{ animationDelay: `${i * 20}ms` }}
                            >
                                <span className="text-xs text-text font-mono">{log.ip}</span>
                                <span className="text-xs text-subtle font-mono truncate pr-4">{log.endpoint}</span>
                                <span className={`text-xs font-mono font-600 ${methodColors[log.method] || "text-text"}`}>
                  {log.method}
                </span>
                                <span className="text-xs text-subtle">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-subtle">
                Page {page + 1} of {totalPages}
              </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchLogs(page - 1)}
                                    disabled={page === 0}
                                    className="flex items-center gap-1 text-xs text-subtle hover:text-text border border-border rounded px-3 py-1.5 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft size={12} /> Prev
                                </button>
                                <button
                                    onClick={() => fetchLogs(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    className="flex items-center gap-1 text-xs text-subtle hover:text-text border border-border rounded px-3 py-1.5 disabled:opacity-30 transition-colors"
                                >
                                    Next <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}