"use client";

import { useState } from "react";
import { Save, Database, Shield, Bell, Palette } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function SettingsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Settings" subtitle="Configure your admin dashboard" />

                <div className="admin-content">
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === "general" ? "active" : ""}`}
                            onClick={() => setActiveTab("general")}
                        >
                            General
                        </button>
                        <button
                            className={`admin-tab ${activeTab === "database" ? "active" : ""}`}
                            onClick={() => setActiveTab("database")}
                        >
                            Database
                        </button>
                        <button
                            className={`admin-tab ${activeTab === "notifications" ? "active" : ""}`}
                            onClick={() => setActiveTab("notifications")}
                        >
                            Notifications
                        </button>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-body">
                            {activeTab === "general" && (
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">App Name</label>
                                        <input
                                            type="text"
                                            className="admin-form-input"
                                            defaultValue="PowerHouse"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">App Description</label>
                                        <textarea
                                            className="admin-form-textarea"
                                            rows={3}
                                            defaultValue="AI-powered fitness app with gamification"
                                        />
                                    </div>
                                    <div className="admin-form-row">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Contact Email</label>
                                            <input
                                                type="email"
                                                className="admin-form-input"
                                                defaultValue="support@powerhouse.app"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Support URL</label>
                                            <input
                                                type="url"
                                                className="admin-form-input"
                                                defaultValue="https://powerhouse.app/support"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "database" && (
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                            padding: "20px",
                                            background: "#f8fafc",
                                            borderRadius: "16px",
                                            marginBottom: "24px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                background: "rgba(34, 197, 94, 0.1)",
                                                borderRadius: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#22c55e",
                                            }}
                                        >
                                            <Database size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 600 }}>Database Status</h3>
                                            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                                                Connected to Supabase
                                            </p>
                                        </div>
                                        <span
                                            className="admin-tag green"
                                            style={{ marginLeft: "auto" }}
                                        >
                                            Connected
                                        </span>
                                    </div>

                                    <div className="admin-form">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Supabase URL</label>
                                            <input
                                                type="text"
                                                className="admin-form-input"
                                                placeholder="https://your-project.supabase.co"
                                                disabled
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Anon Key</label>
                                            <input
                                                type="password"
                                                className="admin-form-input"
                                                placeholder="••••••••••••••••"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Email notifications for new users</span>
                                        </label>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Daily activity reports</span>
                                        </label>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" />
                                            <span>Weekly analytics summary</span>
                                        </label>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-checkbox">
                                            <input type="checkbox" defaultChecked />
                                            <span>Alert on system errors</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
                                <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}