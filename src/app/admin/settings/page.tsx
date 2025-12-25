"use client";

import { useState, useEffect } from "react";
import { Save, Database } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { getCurrentAdmin, updateAdminProfile, isViewerRole } from "@/lib/auth";

export default function SettingsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [isViewer, setIsViewer] = useState(false);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        const loadAdmin = async () => {
            const admin = await getCurrentAdmin();
            if (admin) {
                setProfileData({
                    username: admin.username,
                    email: admin.email,
                    password: ""
                });
            }
            setIsViewer(isViewerRole());
        };
        loadAdmin();
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = async () => {
        if (isViewer) {
            toast.error("Viewer account cannot perform this action");
            return;
        }

        try {
            await updateAdminProfile(profileData);
            toast.success("Profile updated successfully!");
            setProfileData(prev => ({ ...prev, password: "" }));
        } catch (error) {
            const err = error as Error;
            toast.error(err.message || "Failed to update profile");
        }
    };

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`admin-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            />

            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileMenuOpen={isMobileMenuOpen}
            />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Settings" subtitle="Configure your admin dashboard" onMenuClick={toggleMobileMenu} />

                <div className="admin-content">
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === "general" ? "active" : ""}`}
                            onClick={() => setActiveTab("general")}
                        >
                            General
                        </button>
                        <button
                            className={`admin-tab ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile
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

                            {activeTab === "profile" && (
                                <div className="admin-form">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="admin-form-input"
                                            value={profileData.username}
                                            onChange={handleProfileChange}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="admin-form-input"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">New Password (leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="admin-form-input"
                                            value={profileData.password}
                                            onChange={handleProfileChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {isViewer && (
                                        <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "8px" }}>
                                            ⚠️ Viewer account cannot modify profile settings.
                                        </p>
                                    )}
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
                                <button
                                    className="admin-btn admin-btn-primary"
                                    onClick={activeTab === 'profile' ? handleProfileSave : handleSave}
                                    disabled={activeTab === 'profile' && isViewer}
                                >
                                    <Save size={18} />
                                    {activeTab === 'profile' ? 'Update Profile' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}