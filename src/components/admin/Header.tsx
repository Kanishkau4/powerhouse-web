"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, Menu, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { signOutAdmin, getCurrentAdmin } from "@/lib/auth";

interface HeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminUsername, setAdminUsername] = useState("Admin");
    const [adminRole, setAdminRole] = useState<'admin' | 'viewer'>('admin');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadAdminInfo = useCallback(async () => {
        const admin = await getCurrentAdmin();
        if (admin) {
            setAdminEmail(admin.email);
            setAdminUsername(admin.username);
            setAdminRole(admin.role);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadAdminInfo();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [loadAdminInfo]);

    const handleLogout = async () => {
        try {
            await signOutAdmin();
            toast.success("Logged out successfully");
            router.push("/admin/login");
        } catch (error) {
            toast.error("Failed to logout");
            console.error(error);
        }
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                {onMenuClick && (
                    <button
                        className="admin-header-icon-btn"
                        onClick={onMenuClick}
                        style={{ marginRight: "8px" }}
                    >
                        <Menu size={20} />
                    </button>
                )}
                <div>
                    <h1 className="admin-header-title">{title}</h1>
                    {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="admin-header-right">
                <div className="admin-search">
                    <Search size={18} color="#64748b" />
                    <input type="text" placeholder="Search anything..." />
                </div>

                <button className="admin-header-icon-btn">
                    <Bell size={20} />
                    <span className="admin-notification-dot" />
                </button>

                <div
                    className="admin-user-menu"
                    onClick={() => setShowDropdown(!showDropdown)}
                    ref={dropdownRef}
                    style={{ position: "relative", cursor: "pointer" }}
                >
                    <div className="admin-user-avatar">{adminUsername.charAt(0).toUpperCase()}</div>
                    <div className="admin-user-info">
                        <span className="admin-user-name">{adminUsername}</span>
                        <span className="admin-user-role">
                            {adminRole === 'admin' ? 'Super Admin' : 'Viewer'}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        color="#64748b"
                        style={{
                            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease"
                        }}
                    />

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            background: "white",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                            minWidth: "220px",
                            zIndex: 1000,
                            overflow: "hidden",
                            border: "1px solid #e2e8f0"
                        }}>
                            {/* User Info Section */}
                            <div style={{
                                padding: "16px",
                                borderBottom: "1px solid #e2e8f0",
                                background: "#f8fafc"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "4px"
                                }}>
                                    <User size={16} color="#64748b" />
                                    <span style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "#1e293b"
                                    }}>
                                        {adminUsername}
                                    </span>
                                    <span style={{
                                        fontSize: "0.7rem",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        background: adminRole === 'admin' ? '#22c55e' : '#3b82f6',
                                        color: 'white',
                                        fontWeight: 600,
                                        marginLeft: 'auto'
                                    }}>
                                        {adminRole === 'admin' ? 'ADMIN' : 'VIEWER'}
                                    </span>
                                </div>
                                {adminEmail && (
                                    <p style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        margin: 0,
                                        paddingLeft: "24px"
                                    }}>
                                        {adminEmail}
                                    </p>
                                )}
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    background: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "#ef4444",
                                    transition: "background 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#fef2f2";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "white";
                                }}
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}