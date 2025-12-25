"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, User } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function UsersPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        height: "",
        current_weight: "",
        fitness_goal: "",
        activity_level: "Moderate",
        gender: "",
        age: "",
        xp_points: "0",
        level: "1",
    });

    const fetchUsers = async (isReload = false) => {
        if (isReload) setLoading(true);

        let adminEmails: string[] = ['test@powerhouse.local', 'admin@powerhouse.com']

        try {
            // This might fail on client-side without service role key
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
            if (!authError && authUsers) {
                adminEmails = [...adminEmails, ...authUsers.users.map(u => u.email).filter((e): e is string => !!e)]
            }
        } catch {
            console.log("Note: Could not list auth users directly, using fallback filtering.")
        }

        // Fetch count to detect RLS issues (if count > 0 but data empty)
        const { data, count, error } = await supabase
            .from("users")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch users");
            console.error("Supabase Error:", error);
        } else {
            console.log("Users fetched:", data?.length, "Total Count:", count);

            // Filter out admin users (users whose email/username is an admin or contains admin pattern)
            const filteredUsers = data?.filter(user => {
                const isAdminEmail = adminEmails.includes(user.email) ||
                    user.email.endsWith('@powerhouse.local') ||
                    user.email.toLowerCase().includes('admin');
                const isAdminUsername = user.username?.toLowerCase().includes('admin');

                return !isAdminEmail && !isAdminUsername;
            }) || []

            setUsers(filteredUsers);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            username: formData.username,
            email: formData.email,
            height: formData.height ? parseFloat(formData.height) : null,
            current_weight: formData.current_weight
                ? parseFloat(formData.current_weight)
                : null,
            fitness_goal: formData.fitness_goal || null,
            activity_level: formData.activity_level,
            gender: formData.gender || null,
            age: formData.age ? parseInt(formData.age) : null,
            xp_points: parseInt(formData.xp_points),
            level: parseInt(formData.level),
        };

        if (selectedUser) {
            // Update
            const { error } = await supabase
                .from("users")
                .update(userData)
                .eq("user_id", selectedUser.user_id);

            if (error) {
                toast.error("Failed to update user");
                console.error(error);
            } else {
                toast.success("User updated successfully");
                setIsModalOpen(false);
                fetchUsers();
            }
        } else {
            // Create
            const { error } = await supabase.from("users").insert([userData]);

            if (error) {
                toast.error("Failed to create user");
                console.error(error);
            } else {
                toast.success("User created successfully");
                setIsModalOpen(false);
                fetchUsers();
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("user_id", selectedUser.user_id);

        if (error) {
            toast.error("Failed to delete user");
            console.error(error);
        } else {
            toast.success("User deleted successfully");
            setIsDeleteModalOpen(false);
            fetchUsers();
        }
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setFormData({
            username: "",
            email: "",
            height: "",
            current_weight: "",
            fitness_goal: "",
            activity_level: "Moderate",
            gender: "",
            age: "",
            xp_points: "0",
            level: "1",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username || "",
            email: user.email || "",
            height: user.height?.toString() || "",
            current_weight: user.current_weight?.toString() || "",
            fitness_goal: user.fitness_goal || "",
            activity_level: user.activity_level || "Moderate",
            gender: user.gender || "",
            age: user.age?.toString() || "",
            xp_points: user.xp_points?.toString() || "0",
            level: user.level?.toString() || "1",
        });
        setIsModalOpen(true);
    };

    const openViewModal = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const columns: Column<User>[] = [
        {
            key: "profile_picture_url",
            label: "Avatar",
        },
        {
            key: "username",
            label: "Username",
            sortable: true,
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
        },
        {
            key: "level",
            label: "Level",
            sortable: true,
            render: (user: User) => (
                <span className="admin-tag green">Level {user.level}</span>
            ),
        },
        {
            key: "xp_points",
            label: "XP",
            sortable: true,
            render: (user: User) => (
                <span style={{ fontWeight: 600 }}>
                    {user.xp_points?.toLocaleString()}
                </span>
            ),
        },
        {
            key: "fitness_goal",
            label: "Goal",
            render: (user: User) => user.fitness_goal || "-",
        },
        {
            key: "created_at",
            label: "Joined",
            sortable: true,
            render: (user: User) =>
                new Date(user.created_at).toLocaleDateString(),
        },
    ];

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
                <Header
                    title="Users"
                    subtitle="Manage all registered users in PowerHouse"
                    onMenuClick={toggleMobileMenu}
                />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={users}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        onRefresh={() => fetchUsers(true)}
                        searchPlaceholder="Search users..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? "Edit User" : "Add New User"}
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={handleSubmit}
                        >
                            {selectedUser ? "Update User" : "Create User"}
                        </button>
                    </>
                }
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Weight (kg)</label>
                            <input
                                type="number"
                                name="current_weight"
                                value={formData.current_weight}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Fitness Goal</label>
                            <select
                                name="fitness_goal"
                                value={formData.fitness_goal}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="">Select Goal</option>
                                <option value="Lose Weight">Lose Weight</option>
                                <option value="Build Muscle">Build Muscle</option>
                                <option value="Stay Fit">Stay Fit</option>
                                <option value="Gain Weight">Gain Weight</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Activity Level</label>
                            <select
                                name="activity_level"
                                value={formData.activity_level}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="Sedentary">Sedentary</option>
                                <option value="Light">Light</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Active">Active</option>
                                <option value="Very Active">Very Active</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">XP Points</label>
                            <input
                                type="number"
                                name="xp_points"
                                value={formData.xp_points}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Level</label>
                            <input
                                type="number"
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                min="1"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="User Details"
            >
                {selectedUser && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                padding: "20px",
                                background: "#f8fafc",
                                borderRadius: "16px",
                            }}
                        >
                            {selectedUser.profile_picture_url ? (
                                <Image
                                    src={selectedUser.profile_picture_url}
                                    alt=""
                                    width={80}
                                    height={80}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #22c55e, #4ade80)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "2rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {selectedUser.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                    {selectedUser.username}
                                </h3>
                                <p style={{ color: "#64748b" }}>{selectedUser.email}</p>
                                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                    <span className="admin-tag green">
                                        Level {selectedUser.level}
                                    </span>
                                    <span className="admin-tag orange">
                                        {selectedUser.xp_points?.toLocaleString()} XP
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Height
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.height ? `${selectedUser.height} cm` : "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Weight
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.current_weight
                                        ? `${selectedUser.current_weight} kg`
                                        : "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Gender
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.gender || "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Age
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.age || "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Fitness Goal
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.fitness_goal || "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Activity Level
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {selectedUser.activity_level || "-"}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Joined
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {new Date(selectedUser.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
                size="sm"
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                            Delete
                        </button>
                    </>
                }
            >
                <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedUser?.username}</strong>? This action cannot be
                    undone.
                </p>
            </Modal>
        </>
    );
}