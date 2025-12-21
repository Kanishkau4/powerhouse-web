"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
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

                <div className="admin-user-menu">
                    <div className="admin-user-avatar">AD</div>
                    <div className="admin-user-info">
                        <span className="admin-user-name">Admin</span>
                        <span className="admin-user-role">Super Admin</span>
                    </div>
                    <ChevronDown size={16} color="#64748b" />
                </div>
            </div>
        </header>
    );
}