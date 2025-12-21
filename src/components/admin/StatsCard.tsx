"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    iconColor: "green" | "orange" | "purple" | "blue";
}

export default function StatsCard({
    label,
    value,
    change,
    icon: Icon,
    iconColor,
}: StatsCardProps) {
    const isPositive = change && change > 0;

    return (
        <div className="admin-stat-card">
            <div className="admin-stat-header">
                <div className={`admin-stat-icon ${iconColor}`}>
                    <Icon size={24} />
                </div>
                {change !== undefined && (
                    <div className={`admin-stat-change ${isPositive ? "up" : "down"}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-value">{value}</div>
        </div>
    );
}