import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppsPage from "./pages/AppsPage";
import LogsPage from "./pages/LogsPage";
import BlocksPage from "./pages/BlocksPage";
import DemoPage from "./pages/DemoPage";
import DocsPage from "./pages/DocsPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route
                    path="/apps"
                    element={
                        <ProtectedRoute>
                            <Layout><AppsPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/apps/:appId/logs"
                    element={
                        <ProtectedRoute>
                            <Layout><LogsPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/blocks"
                    element={
                        <ProtectedRoute>
                            <Layout><BlocksPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/demo"
                    element={
                        <ProtectedRoute>
                            <Layout><DemoPage /></Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/docs"
                    element={
                        <ProtectedRoute>
                            <Layout><DocsPage /></Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/apps" replace />} />
            </Routes>
        </BrowserRouter>
    );
}