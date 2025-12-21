"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Tip, TipCategory } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function TipsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [tips, setTips] = useState<Tip[]>([]);
    const [categories, setCategories] = useState<TipCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        content: "",
        summary: "",
        image_url: "",
        video_url: "",
        difficulty_level: "all",
        reading_time: "3",
        is_featured: false,
    });

    useEffect(() => {
        fetchTips();
        fetchCategories();
    }, []);

    const fetchTips = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("tips")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch tips");
        } else {
            setTips(data || []);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase
            .from("tip_categories")
            .select("*")
            .order("sort_order");
        setCategories(data || []);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tipData = {
            title: formData.title,
            category: formData.category,
            content: formData.content,
            summary: formData.summary || null,
            image_url: formData.image_url || null,
            video_url: formData.video_url || null,
            difficulty_level: formData.difficulty_level,
            reading_time: parseInt(formData.reading_time),
            is_featured: formData.is_featured,
        };

        if (selectedTip) {
            const { error } = await supabase
                .from("tips")
                .update(tipData)
                .eq("tip_id", selectedTip.tip_id);

            if (error) {
                toast.error("Failed to update tip");
            } else {
                toast.success("Tip updated successfully");
                setIsModalOpen(false);
                fetchTips();
            }
        } else {
            const { error } = await supabase.from("tips").insert([tipData]);

            if (error) {
                toast.error("Failed to create tip");
                console.error(error);
            } else {
                toast.success("Tip created successfully");
                setIsModalOpen(false);
                fetchTips();
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedTip) return;

        const { error } = await supabase
            .from("tips")
            .delete()
            .eq("tip_id", selectedTip.tip_id);

        if (error) {
            toast.error("Failed to delete tip");
        } else {
            toast.success("Tip deleted successfully");
            setIsDeleteModalOpen(false);
            fetchTips();
        }
    };

    const openAddModal = () => {
        setSelectedTip(null);
        setFormData({
            title: "",
            category: categories[0]?.name || "",
            content: "",
            summary: "",
            image_url: "",
            video_url: "",
            difficulty_level: "all",
            reading_time: "3",
            is_featured: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (tip: Tip) => {
        setSelectedTip(tip);
        setFormData({
            title: tip.title,
            category: tip.category,
            content: tip.content,
            summary: tip.summary || "",
            image_url: tip.image_url || "",
            video_url: tip.video_url || "",
            difficulty_level: tip.difficulty_level || "all",
            reading_time: tip.reading_time?.toString() || "3",
            is_featured: tip.is_featured,
        });
        setIsModalOpen(true);
    };

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case "beginner":
                return "green";
            case "intermediate":
                return "orange";
            case "advanced":
                return "red";
            default:
                return "blue";
        }
    };

    const columns: Column<Tip>[] = [
        { key: "image_url", label: "Image" },
        { key: "title", label: "Title", sortable: true },
        {
            key: "category",
            label: "Category",
            sortable: true,
            render: (tip) => <span className="admin-tag purple">{tip.category}</span>,
        },
        {
            key: "difficulty_level",
            label: "Level",
            render: (tip) => (
                <span className={`admin-tag ${getDifficultyColor(tip.difficulty_level || "")}`}>
                    {tip.difficulty_level || "all"}
                </span>
            ),
        },
        {
            key: "is_featured",
            label: "Featured",
            render: (tip) =>
                tip.is_featured ? (
                    <Star size={18} fill="#f59e0b" color="#f59e0b" />
                ) : (
                    <Star size={18} color="#cbd5e1" />
                ),
        },
        {
            key: "view_count",
            label: "Views",
            sortable: true,
            render: (tip) => tip.view_count?.toLocaleString() || "0",
        },
        { key: "reading_time", label: "Read Time", render: (tip) => `${tip.reading_time} min` },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Tips" subtitle="Manage fitness tips and articles" />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={tips}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={(tip) => {
                            setSelectedTip(tip);
                            setIsViewModalOpen(true);
                        }}
                        onEdit={openEditModal}
                        onDelete={(tip) => {
                            setSelectedTip(tip);
                            setIsDeleteModalOpen(true);
                        }}
                        onRefresh={fetchTips}
                        searchPlaceholder="Search tips..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTip ? "Edit Tip" : "Add New Tip"}
                size="lg"
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                            {selectedTip ? "Update" : "Create"}
                        </button>
                    </>
                }
            >
                <form className="admin-form">
                    <div className="admin-form-group">
                        <label className="admin-form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="admin-form-input"
                            required
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="admin-form-select"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.name}>
                                        {cat.display_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Difficulty Level</label>
                            <select
                                name="difficulty_level"
                                value={formData.difficulty_level}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="all">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Summary</label>
                        <input
                            type="text"
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            className="admin-form-input"
                            placeholder="Brief summary..."
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="admin-form-textarea"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Reading Time (min)</label>
                            <input
                                type="number"
                                name="reading_time"
                                value={formData.reading_time}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-checkbox">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleInputChange}
                            />
                            <span>Featured Tip</span>
                        </label>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Tip Details"
                size="lg"
            >
                {selectedTip && (
                    <div>
                        {selectedTip.image_url && (
                            <Image
                                src={selectedTip.image_url}
                                alt={selectedTip.title}
                                width={600}
                                height={300}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "16px",
                                    marginBottom: "24px",
                                }}
                            />
                        )}
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                            {selectedTip.title}
                        </h3>
                        <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
                            <span className="admin-tag purple">{selectedTip.category}</span>
                            <span
                                className={`admin-tag ${getDifficultyColor(
                                    selectedTip.difficulty_level || ""
                                )}`}
                            >
                                {selectedTip.difficulty_level}
                            </span>
                            <span className="admin-tag blue">{selectedTip.reading_time} min read</span>
                        </div>
                        <p style={{ color: "#64748b", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                            {selectedTip.content}
                        </p>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Tip"
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
                    Are you sure you want to delete <strong>{selectedTip?.title}</strong>?
                </p>
            </Modal>
        </>
    );
}