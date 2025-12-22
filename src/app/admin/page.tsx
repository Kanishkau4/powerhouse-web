"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Dumbbell,
    Utensils,
    Trophy,
} from "lucide-react";
import Image from "next/image";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import StatsCard from "@/components/admin/StatsCard";
import { supabase, User as DBUser } from "@/lib/supabase";
import { format, subDays, startOfDay, parseISO } from "date-fns";

// Sample data for charts (Calories - keeping as sample since no logs table exists yet)
const caloriesData = [
    { name: "Mon", burned: 2400, consumed: 2100 },
    { name: "Tue", burned: 2800, consumed: 2300 },
    { name: "Wed", burned: 2200, consumed: 2000 },
    { name: "Thu", burned: 3100, consumed: 2500 },
    { name: "Fri", burned: 2900, consumed: 2200 },
    { name: "Sat", burned: 3500, consumed: 2800 },
    { name: "Sun", burned: 2700, consumed: 2400 },
];

const COLORS = ["#22c55e", "#f97316", "#8b5cf6", "#3b82f6", "#ef4444", "#f59e0b", "#ec4899"];

interface DashboardStats {
    totalUsers: number;
    totalWorkouts: number;
    totalFoods: number;
    activeChallenges: number;
}

interface UserGrowth {
    name: string;
    users: number;
    workouts: number;
    [key: string]: string | number;
}

interface WorkoutTypeDist {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

export default function AdminDashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalWorkouts: 0,
        totalFoods: 0,
        activeChallenges: 0,
    });
    const [recentUsers, setRecentUsers] = useState<DBUser[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<UserGrowth[]>([]);
    const [workoutTypeData, setWorkoutTypeData] = useState<WorkoutTypeDist[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Fetch counts
            const [usersRes, workoutsRes, foodsRes, challengesRes] = await Promise.all([
                supabase.from("users").select("*", { count: "exact", head: true }),
                supabase.from("workouts").select("*", { count: "exact", head: true }),
                supabase.from("foods").select("*", { count: "exact", head: true }),
                supabase.from("challenges").select("*", { count: "exact", head: true }),
            ]);

            setStats({
                totalUsers: usersRes.count || 0,
                totalWorkouts: workoutsRes.count || 0,
                totalFoods: foodsRes.count || 0,
                activeChallenges: challengesRes.count || 0,
            });

            // 2. Fetch Recent Users
            const { data: users } = await supabase
                .from("users")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            setRecentUsers(users || []);

            // 3. Process User Growth (Last 7 Days)
            const endDate = new Date();
            const startDate = subDays(endDate, 6); // Last 7 days including today

            // We fetch all users to aggregate client-side (for small-scale)
            // Ideally use a DB function for aggregation
            const { data: allUsers } = await supabase
                .from("users")
                .select("created_at")
                .gte("created_at", startOfDay(startDate).toISOString());

            const growthMap = new Map();
            // Initialize last 7 days with 0
            for (let i = 0; i < 7; i++) {
                const d = subDays(endDate, i);
                const dayName = format(d, "EEE"); // Mon, Tue
                growthMap.set(dayName, { name: dayName, users: 0, workouts: 0 }); // Workouts placeholder
            }

            if (allUsers) {
                allUsers.forEach((u) => {
                    const d = parseISO(u.created_at);
                    const dayName = format(d, "EEE");
                    if (growthMap.has(dayName)) {
                        growthMap.get(dayName).users += 1;
                    }
                });
            }

            // Fetch recent workouts for the same chart
            const { data: recentWorkouts } = await supabase
                .from("workouts")
                .select("created_at")
                .gte("created_at", startOfDay(startDate).toISOString());

            if (recentWorkouts) {
                recentWorkouts.forEach((w) => {
                    const d = parseISO(w.created_at);
                    const dayName = format(d, "EEE");
                    if (growthMap.has(dayName)) {
                        growthMap.get(dayName).workouts += 1;
                    }
                });
            }

            // Convert Map to Array and Reverse (Mon -> Sun)
            // Actually growthMap keys are "Wed", "Tue", etc. 
            // We want chronological order.
            const chartData = [];
            for (let i = 6; i >= 0; i--) {
                const d = subDays(endDate, i);
                const dayName = format(d, "EEE");
                chartData.push(growthMap.get(dayName));
            }
            setUserGrowthData(chartData);


            // 4. Process Workout Categories
            const { data: allWorkoutCats } = await supabase.from("workouts").select("category");
            if (allWorkoutCats) {
                const catMap: Record<string, number> = {};
                allWorkoutCats.forEach((w) => {
                    const cat = w.category || "Uncategorized";
                    catMap[cat] = (catMap[cat] || 0) + 1;
                });

                const pieData = Object.keys(catMap).map((key, index) => ({
                    name: key,
                    value: catMap[key],
                    color: COLORS[index % COLORS.length],
                }));
                setWorkoutTypeData(pieData);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header
                    title="Dashboard"
                    subtitle="Welcome back! Here's your fitness ecosystem overview."
                />

                <div className="admin-content">
                    {/* Stats Grid */}
                    <div className="admin-stats-grid">
                        <StatsCard
                            label="Total Users"
                            value={stats.totalUsers.toLocaleString()}
                            change={12.5}
                            icon={Users}
                            iconColor="green"
                        />
                        <StatsCard
                            label="Total Workouts"
                            value={stats.totalWorkouts.toLocaleString()}
                            change={8.2}
                            icon={Dumbbell}
                            iconColor="orange"
                        />
                        <StatsCard
                            label="Food Items"
                            value={stats.totalFoods.toLocaleString()}
                            change={5.1}
                            icon={Utensils}
                            iconColor="purple"
                        />
                        <StatsCard
                            label="Active Challenges"
                            value={stats.activeChallenges.toLocaleString()}
                            change={15.3}
                            icon={Trophy}
                            iconColor="blue"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="admin-charts-grid">
                        {/* User Engagement Chart */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3 className="admin-card-title">New Activity (Last 7 Days)</h3>
                                <div className="admin-filters">
                                    <select className="admin-filter-select">
                                        <option>Last 7 days</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={userGrowthData}>
                                            <defs>
                                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#1e293b",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    color: "#fff",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="users"
                                                stroke="#22c55e"
                                                strokeWidth={3}
                                                fill="url(#colorUsers)"
                                                name="New Users"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="workouts"
                                                stroke="#f97316"
                                                strokeWidth={3}
                                                fill="url(#colorWorkouts)"
                                                name="New Workouts"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Workout Distribution */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3 className="admin-card-title">Workout Categories</h3>
                            </div>
                            <div className="admin-card-body">
                                <div className="admin-chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={workoutTypeData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {workoutTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#1e293b",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    color: "#fff",
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                formatter={(value) => (
                                                    <span style={{ color: "#64748b", fontSize: "12px" }}>
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calories Chart (Placeholder for now) */}
                    <div className="admin-card" style={{ marginBottom: "32px" }}>
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Calories Overview (Demo Data)</h3>
                            <span className="admin-tag yellow">Coming Soon</span>
                        </div>
                        <div className="admin-card-body">
                            <div className="admin-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={caloriesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "#1e293b",
                                                border: "none",
                                                borderRadius: "12px",
                                                color: "#fff",
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="burned"
                                            name="Burned"
                                            fill="#22c55e"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="consumed"
                                            name="Consumed"
                                            fill="#f97316"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Users Table */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Recent Users</h3>
                            <a href="/admin/users" className="admin-btn admin-btn-secondary admin-btn-sm">
                                View All
                            </a>
                        </div>
                        <div className="admin-table-container">
                            {recentUsers.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                                    No users found.
                                </div>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Level</th>
                                            <th>XP Points</th>
                                            <th>Fitness Goal</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((user) => (
                                            <tr key={user.user_id}>
                                                <td>
                                                    <div className="admin-table-user">
                                                        {user.profile_picture_url ? (
                                                            <Image
                                                                src={user.profile_picture_url}
                                                                alt=""
                                                                width={40}
                                                                height={40}
                                                                className="admin-table-avatar"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="admin-table-avatar"
                                                                style={{
                                                                    background:
                                                                        "linear-gradient(135deg, #22c55e, #4ade80)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {user.username?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="admin-table-user-info">
                                                            <span className="admin-table-user-name">
                                                                {user.username}
                                                            </span>
                                                            <span className="admin-table-user-email">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-tag green">
                                                        Level {user.level}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>
                                                    {user.xp_points?.toLocaleString()} XP
                                                </td>
                                                <td>{user.fitness_goal || "-"}</td>
                                                <td style={{ color: "#64748b" }}>
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}