"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Utensils,
    Trophy,
    Award,
    Lightbulb,
    ChefHat,
    UsersRound,
    Activity,
    ChevronLeft,
    ChevronRight,
    Settings,
    FolderOpen,
} from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const navSections = [
    {
        title: "Overview",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        title: "User Management",
        items: [
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Teams", href: "/admin/teams", icon: UsersRound },
        ],
    },
    {
        title: "Content",
        items: [
            { name: "Exercises", href: "/admin/exercises", icon: Activity },
            { name: "Workouts", href: "/admin/workouts", icon: Dumbbell },
            { name: "Foods", href: "/admin/foods", icon: Utensils },
            { name: "Recipes", href: "/admin/recipes", icon: ChefHat },
        ],
    },
    {
        title: "Engagement",
        items: [
            { name: "Challenges", href: "/admin/challenges", icon: Trophy },
            { name: "Badges", href: "/admin/badges", icon: Award },
            { name: "Tips", href: "/admin/tips", icon: Lightbulb },
            { name: "Tip Categories", href: "/admin/tip-categories", icon: FolderOpen },
        ],
    },
    {
        title: "System",
        items: [
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* Logo */}
            <div className="admin-logo-area">
                <div className="admin-logo-icon">
                    <Dumbbell size={22} />
                </div>
                <span className="admin-logo-text">PowerHouse</span>
            </div>

            {/* Navigation */}
            <nav className="admin-nav">
                {navSections.map((section) => (
                    <div key={section.title} className="admin-nav-section">
                        <div className="admin-nav-section-title">{section.title}</div>
                        <ul className="admin-nav-list">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li
                                        key={item.name}
                                        className={`admin-nav-item ${active ? "active" : ""}`}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`admin-nav-link ${active ? "active" : ""}`}
                                        >
                                            <Icon size={20} />
                                            <span className="admin-nav-text">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="admin-sidebar-footer">
                <button
                    className="admin-collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    <span>Collapse</span>
                </button>
            </div>
        </aside>
    );
}