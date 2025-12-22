"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Badge } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function BadgesPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        badge_name: "",
        description: "",
        icon_url: "",
        requirement_description: "",
    });

    const fetchBadges = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("badges")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch badges");
        } else {
            setBadges(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBadges();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "icon_url" && value) {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const badgeData = {
            badge_name: formData.badge_name,
            description: formData.description || null,
            icon_url: formData.icon_url || null,
            requirement_description: formData.requirement_description || null,
        };

        if (selectedBadge) {
            const { error } = await supabase
                .from("badges")
                .update(badgeData)
                .eq("badge_id", selectedBadge.badge_id);

            if (error) {
                toast.error("Failed to update badge");
            } else {
                toast.success("Badge updated successfully");
                setIsModalOpen(false);
                fetchBadges(true);
            }
        } else {
            const { error } = await supabase.from("badges").insert([badgeData]);

            if (error) {
                toast.error("Failed to create badge");
            } else {
                toast.success("Badge created successfully");
                setIsModalOpen(false);
                fetchBadges(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedBadge) return;

        const { error } = await supabase
            .from("badges")
            .delete()
            .eq("badge_id", selectedBadge.badge_id);

        if (error) {
            toast.error("Failed to delete badge");
        } else {
            toast.success("Badge deleted successfully");
            setIsDeleteModalOpen(false);
            fetchBadges(true);
        }
    };

    const openAddModal = () => {
        setSelectedBadge(null);
        setFormData({
            badge_name: "",
            description: "",
            icon_url: "",
            requirement_description: "",
        });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (badge: Badge) => {
        setSelectedBadge(badge);
        setFormData({
            badge_name: badge.badge_name || "",
            description: badge.description || "",
            icon_url: badge.icon_url || "",
            requirement_description: badge.requirement_description || "",
        });
        setImagePreview(badge.icon_url || null);
        setIsModalOpen(true);
    };

    const columns: Column<Badge>[] = [
        { key: "icon_url", label: "Icon" },
        { key: "badge_name", label: "Name", sortable: true },
        {
            key: "description",
            label: "Description",
            render: (badge) =>
                badge.description ? badge.description.substring(0, 40) + "..." : "-",
        },
        {
            key: "requirement_description",
            label: "Requirement",
            render: (badge) =>
                badge.requirement_description
                    ? badge.requirement_description.substring(0, 40) + "..."
                    : "-",
        },
        { key: "created_at", label: "Created", sortable: true },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Badges" subtitle="Manage achievement badges and rewards" />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={badges}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={(badge) => {
                            setSelectedBadge(badge);
                            setIsViewModalOpen(true);
                        }}
                        onEdit={openEditModal}
                        onDelete={(badge) => {
                            setSelectedBadge(badge);
                            setIsDeleteModalOpen(true);
                        }}
                        onRefresh={() => fetchBadges(true)}
                        searchPlaceholder="Search badges..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedBadge ? "Edit Badge" : "Add New Badge"}
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                            {selectedBadge ? "Update" : "Create"}
                        </button>
                    </>
                }
            >
                <form className="admin-form">
                    <div className="admin-form-group">
                        <label className="admin-form-label">Badge Name *</label>
                        <input
                            type="text"
                            name="badge_name"
                            value={formData.badge_name}
                            onChange={handleInputChange}
                            className="admin-form-input"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="admin-form-textarea"
                            rows={3}
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Icon URL</label>
                        <input
                            type="url"
                            name="icon_url"
                            value={formData.icon_url}
                            onChange={handleInputChange}
                            className="admin-form-input"
                        />
                    </div>

                    {imagePreview && (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={80}
                                height={80}
                                style={{ borderRadius: "12px", objectFit: "cover" }}
                                onError={() => setImagePreview(null)}
                            />
                        </div>
                    )}

                    <div className="admin-form-group">
                        <label className="admin-form-label">Requirement Description</label>
                        <textarea
                            name="requirement_description"
                            value={formData.requirement_description}
                            onChange={handleInputChange}
                            className="admin-form-textarea"
                            rows={2}
                            placeholder="How can users earn this badge?"
                        />
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Badge Details"
            >
                {selectedBadge && (
                    <div style={{ textAlign: "center" }}>
                        {selectedBadge.icon_url && (
                            <Image
                                src={selectedBadge.icon_url}
                                alt={selectedBadge.badge_name}
                                width={120}
                                height={120}
                                style={{ borderRadius: "24px", marginBottom: "24px" }}
                            />
                        )}
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                            {selectedBadge.badge_name}
                        </h3>
                        {selectedBadge.description && (
                            <p style={{ color: "#64748b", marginTop: "8px" }}>
                                {selectedBadge.description}
                            </p>
                        )}
                        {selectedBadge.requirement_description && (
                            <div
                                style={{
                                    marginTop: "24px",
                                    padding: "16px",
                                    background: "#f8fafc",
                                    borderRadius: "12px",
                                }}
                            >
                                <h4 style={{ fontSize: "0.875rem", color: "#64748b" }}>
                                    How to earn
                                </h4>
                                <p style={{ marginTop: "8px" }}>
                                    {selectedBadge.requirement_description}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Badge"
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
                    Are you sure you want to delete <strong>{selectedBadge?.badge_name}</strong>?
                </p>
            </Modal>
        </>
    );
}