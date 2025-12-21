"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Food } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function FoodsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        food_name: "",
        serving_size_description: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        is_sri_lankan: false,
        image_url: "",
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("foods")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch foods");
            console.error(error);
        } else {
            setFoods(data || []);
        }
        setLoading(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (name === "image_url" && value) {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const foodData = {
            food_name: formData.food_name,
            serving_size_description: formData.serving_size_description || null,
            calories: parseInt(formData.calories),
            protein: parseFloat(formData.protein),
            carbs: parseFloat(formData.carbs),
            fat: parseFloat(formData.fat),
            is_sri_lankan: formData.is_sri_lankan,
            image_url: formData.image_url || null,
        };

        if (selectedFood) {
            const { error } = await supabase
                .from("foods")
                .update(foodData)
                .eq("food_id", selectedFood.food_id);

            if (error) {
                toast.error("Failed to update food");
                console.error(error);
            } else {
                toast.success("Food updated successfully");
                setIsModalOpen(false);
                fetchFoods();
            }
        } else {
            const { error } = await supabase.from("foods").insert([foodData]);

            if (error) {
                toast.error("Failed to create food");
                console.error(error);
            } else {
                toast.success("Food created successfully");
                setIsModalOpen(false);
                fetchFoods();
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedFood) return;

        const { error } = await supabase
            .from("foods")
            .delete()
            .eq("food_id", selectedFood.food_id);

        if (error) {
            toast.error("Failed to delete food");
            console.error(error);
        } else {
            toast.success("Food deleted successfully");
            setIsDeleteModalOpen(false);
            fetchFoods();
        }
    };

    const openAddModal = () => {
        setSelectedFood(null);
        setFormData({
            food_name: "",
            serving_size_description: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            is_sri_lankan: false,
            image_url: "",
        });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (food: Food) => {
        setSelectedFood(food);
        setFormData({
            food_name: food.food_name || "",
            serving_size_description: food.serving_size_description || "",
            calories: food.calories?.toString() || "",
            protein: food.protein?.toString() || "",
            carbs: food.carbs?.toString() || "",
            fat: food.fat?.toString() || "",
            is_sri_lankan: food.is_sri_lankan || false,
            image_url: food.image_url || "",
        });
        setImagePreview(food.image_url || null);
        setIsModalOpen(true);
    };

    const openViewModal = (food: Food) => {
        setSelectedFood(food);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (food: Food) => {
        setSelectedFood(food);
        setIsDeleteModalOpen(true);
    };

    const columns = [
        {
            key: "image_url",
            label: "Image",
        },
        {
            key: "food_name",
            label: "Name",
            sortable: true,
        },
        {
            key: "calories",
            label: "Calories",
            sortable: true,
            render: (food: Food) => (
                <span style={{ fontWeight: 600 }}>{food.calories} kcal</span>
            ),
        },
        {
            key: "protein",
            label: "Protein",
            sortable: true,
            render: (food: Food) => `${food.protein}g`,
        },
        {
            key: "carbs",
            label: "Carbs",
            sortable: true,
            render: (food: Food) => `${food.carbs}g`,
        },
        {
            key: "fat",
            label: "Fat",
            sortable: true,
            render: (food: Food) => `${food.fat}g`,
        },
        {
            key: "is_sri_lankan",
            label: "Sri Lankan",
            render: (food: Food) => (
                <span className={`admin-tag ${food.is_sri_lankan ? "green" : "blue"}`}>
                    {food.is_sri_lankan ? "Yes" : "No"}
                </span>
            ),
        },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Foods" subtitle="Manage food items and nutritional data" />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={foods}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        onRefresh={fetchFoods}
                        searchPlaceholder="Search foods..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedFood ? "Edit Food" : "Add New Food"}
                size="lg"
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
                            {selectedFood ? "Update Food" : "Create Food"}
                        </button>
                    </>
                }
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Food Name *</label>
                            <input
                                type="text"
                                name="food_name"
                                value={formData.food_name}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Serving Size</label>
                            <input
                                type="text"
                                name="serving_size_description"
                                value={formData.serving_size_description}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                placeholder="e.g., 1 cup, 100g"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Calories *</label>
                            <input
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Protein (g) *</label>
                            <input
                                type="number"
                                step="0.1"
                                name="protein"
                                value={formData.protein}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Carbs (g) *</label>
                            <input
                                type="number"
                                step="0.1"
                                name="carbs"
                                value={formData.carbs}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Fat (g) *</label>
                            <input
                                type="number"
                                step="0.1"
                                name="fat"
                                value={formData.fat}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="admin-form-input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {imagePreview && (
                        <div className="admin-form-group">
                            <label className="admin-form-label">Preview</label>
                            <div
                                style={{
                                    position: "relative",
                                    width: "200px",
                                    height: "150px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    onError={() => setImagePreview(null)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData((prev) => ({ ...prev, image_url: "" }));
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        background: "rgba(0,0,0,0.5)",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="admin-form-group">
                        <label className="admin-form-checkbox">
                            <input
                                type="checkbox"
                                name="is_sri_lankan"
                                checked={formData.is_sri_lankan}
                                onChange={handleInputChange}
                            />
                            <span>Sri Lankan Food</span>
                        </label>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Food Details"
                size="lg"
            >
                {selectedFood && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {selectedFood.image_url && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={selectedFood.image_url}
                                    alt={selectedFood.food_name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        )}

                        <div>
                            <h3
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    marginBottom: "8px",
                                }}
                            >
                                {selectedFood.food_name}
                            </h3>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {selectedFood.serving_size_description && (
                                    <span className="admin-tag blue">
                                        {selectedFood.serving_size_description}
                                    </span>
                                )}
                                {selectedFood.is_sri_lankan && (
                                    <span className="admin-tag green">Sri Lankan</span>
                                )}
                            </div>
                        </div>

                        {/* Nutrition Facts */}
                        <div
                            style={{
                                padding: "24px",
                                background: "#f8fafc",
                                borderRadius: "16px",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    marginBottom: "16px",
                                }}
                            >
                                Nutrition Facts
                            </h4>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "16px",
                                }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            color: "#f97316",
                                        }}
                                    >
                                        {selectedFood.calories}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        Calories
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            color: "#22c55e",
                                        }}
                                    >
                                        {selectedFood.protein}g
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        Protein
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            color: "#3b82f6",
                                        }}
                                    >
                                        {selectedFood.carbs}g
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        Carbs
                                    </div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            color: "#8b5cf6",
                                        }}
                                    >
                                        {selectedFood.fat}g
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                        Fat
                                    </div>
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
                title="Delete Food"
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
                    <strong>{selectedFood?.food_name}</strong>? This action cannot be
                    undone.
                </p>
            </Modal>
        </>
    );
}