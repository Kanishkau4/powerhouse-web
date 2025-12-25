"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Workout } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function WorkoutsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        workout_name: "",
        description: "",
        difficulty: "Beginner",
        category: "",
        estimated_duration: "",
        estimated_calories_burned: "",
        image_url: "",
    });

    const fetchWorkouts = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("workouts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch workouts");
            console.error(error);
        } else {
            setWorkouts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWorkouts();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "image_url" && value) {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const workoutData = {
            workout_name: formData.workout_name,
            description: formData.description || null,
            difficulty: formData.difficulty,
            category: formData.category || null,
            estimated_duration: formData.estimated_duration
                ? parseInt(formData.estimated_duration)
                : null,
            estimated_calories_burned: formData.estimated_calories_burned
                ? parseInt(formData.estimated_calories_burned)
                : null,
            image_url: formData.image_url || null,
        };

        if (selectedWorkout) {
            const { error } = await supabase
                .from("workouts")
                .update(workoutData)
                .eq("workout_id", selectedWorkout.workout_id);

            if (error) {
                toast.error("Failed to update workout");
                console.error(error);
            } else {
                toast.success("Workout updated successfully");
                setIsModalOpen(false);
                fetchWorkouts(true);
            }
        } else {
            const { error } = await supabase.from("workouts").insert([workoutData]);

            if (error) {
                toast.error("Failed to create workout");
                console.error(error);
            } else {
                toast.success("Workout created successfully");
                setIsModalOpen(false);
                fetchWorkouts(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedWorkout) return;

        const { error } = await supabase
            .from("workouts")
            .delete()
            .eq("workout_id", selectedWorkout.workout_id);

        if (error) {
            toast.error("Failed to delete workout");
            console.error(error);
        } else {
            toast.success("Workout deleted successfully");
            setIsDeleteModalOpen(false);
            fetchWorkouts(true);
        }
    };

    const openAddModal = () => {
        setSelectedWorkout(null);
        setFormData({
            workout_name: "",
            description: "",
            difficulty: "Beginner",
            category: "",
            estimated_duration: "",
            estimated_calories_burned: "",
            image_url: "",
        });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (workout: Workout) => {
        setSelectedWorkout(workout);
        setFormData({
            workout_name: workout.workout_name || "",
            description: workout.description || "",
            difficulty: workout.difficulty || "Beginner",
            category: workout.category || "",
            estimated_duration: workout.estimated_duration?.toString() || "",
            estimated_calories_burned:
                workout.estimated_calories_burned?.toString() || "",
            image_url: workout.image_url || "",
        });
        setImagePreview(workout.image_url || null);
        setIsModalOpen(true);
    };

    const openViewModal = (workout: Workout) => {
        setSelectedWorkout(workout);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (workout: Workout) => {
        setSelectedWorkout(workout);
        setIsDeleteModalOpen(true);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
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

    const columns = [
        {
            key: "image_url",
            label: "Image",
        },
        {
            key: "workout_name",
            label: "Name",
            sortable: true,
        },
        {
            key: "difficulty",
            label: "Difficulty",
            sortable: true,
            render: (workout: Workout) => (
                <span className={`admin-tag ${getDifficultyColor(workout.difficulty || "")}`}>
                    {workout.difficulty || "-"}
                </span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (workout: Workout) => workout.category || "-",
        },
        {
            key: "estimated_duration",
            label: "Duration",
            sortable: true,
            render: (workout: Workout) =>
                workout.estimated_duration ? `${workout.estimated_duration} min` : "-",
        },
        {
            key: "estimated_calories_burned",
            label: "Calories",
            sortable: true,
            render: (workout: Workout) =>
                workout.estimated_calories_burned
                    ? `${workout.estimated_calories_burned} kcal`
                    : "-",
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
                    title="Workouts"
                    subtitle="Manage workout programs and routines"
                    onMenuClick={toggleMobileMenu}
                />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={workouts}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        onRefresh={() => fetchWorkouts(true)}
                        searchPlaceholder="Search workouts..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedWorkout ? "Edit Workout" : "Add New Workout"}
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
                            {selectedWorkout ? "Update Workout" : "Create Workout"}
                        </button>
                    </>
                }
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Workout Name *</label>
                        <input
                            type="text"
                            name="workout_name"
                            value={formData.workout_name}
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

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="">Select Category</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                                <option value="HIIT">HIIT</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Flexibility">Flexibility</option>
                                <option value="Core">Core</option>
                                <option value="Full Body">Full Body</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Duration (minutes)</label>
                            <input
                                type="number"
                                name="estimated_duration"
                                value={formData.estimated_duration}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Calories Burned</label>
                            <input
                                type="number"
                                name="estimated_calories_burned"
                                value={formData.estimated_calories_burned}
                                onChange={handleInputChange}
                                className="admin-form-input"
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

                    {/* Image Preview */}
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
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Workout Details"
                size="lg"
            >
                {selectedWorkout && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {selectedWorkout.image_url && (
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
                                    src={selectedWorkout.image_url}
                                    alt={selectedWorkout.workout_name}
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
                                {selectedWorkout.workout_name}
                            </h3>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <span
                                    className={`admin-tag ${getDifficultyColor(
                                        selectedWorkout.difficulty || ""
                                    )}`}
                                >
                                    {selectedWorkout.difficulty}
                                </span>
                                {selectedWorkout.category && (
                                    <span className="admin-tag blue">
                                        {selectedWorkout.category}
                                    </span>
                                )}
                            </div>
                            {selectedWorkout.description && (
                                <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                                    {selectedWorkout.description}
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "16px",
                            }}
                        >
                            <div
                                style={{
                                    padding: "16px",
                                    background: "#f8fafc",
                                    borderRadius: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Duration
                                </div>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                    {selectedWorkout.estimated_duration
                                        ? `${selectedWorkout.estimated_duration} min`
                                        : "-"}
                                </div>
                            </div>
                            <div
                                style={{
                                    padding: "16px",
                                    background: "#f8fafc",
                                    borderRadius: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Calories
                                </div>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                    {selectedWorkout.estimated_calories_burned
                                        ? `${selectedWorkout.estimated_calories_burned} kcal`
                                        : "-"}
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
                title="Delete Workout"
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
                    <strong>{selectedWorkout?.workout_name}</strong>? This action cannot be
                    undone.
                </p>
            </Modal>
        </>
    );
}