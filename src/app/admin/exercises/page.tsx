"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Exercise } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function ExercisesPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [formData, setFormData] = useState({
        exercise_name: "",
        description: "",
        video_url: "",
        animation_url: "",
        muscle_group_targeted: "",
    });

    const fetchExercises = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("exercises")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch exercises");
            console.error(error);
        } else {
            setExercises(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchExercises();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const exerciseData = {
            exercise_name: formData.exercise_name,
            description: formData.description || null,
            video_url: formData.video_url || null,
            animation_url: formData.animation_url || null,
            muscle_group_targeted: formData.muscle_group_targeted || null,
        };

        if (selectedExercise) {
            const { error } = await supabase
                .from("exercises")
                .update(exerciseData)
                .eq("exercise_id", selectedExercise.exercise_id);

            if (error) {
                toast.error("Failed to update exercise");
            } else {
                toast.success("Exercise updated successfully");
                setIsModalOpen(false);
                fetchExercises(true);
            }
        } else {
            const { error } = await supabase.from("exercises").insert([exerciseData]);

            if (error) {
                toast.error("Failed to create exercise");
            } else {
                toast.success("Exercise created successfully");
                setIsModalOpen(false);
                fetchExercises(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedExercise) return;

        const { error } = await supabase
            .from("exercises")
            .delete()
            .eq("exercise_id", selectedExercise.exercise_id);

        if (error) {
            toast.error("Failed to delete exercise");
        } else {
            toast.success("Exercise deleted successfully");
            setIsDeleteModalOpen(false);
            fetchExercises(true);
        }
    };

    const openAddModal = () => {
        setSelectedExercise(null);
        setFormData({
            exercise_name: "",
            description: "",
            video_url: "",
            animation_url: "",
            muscle_group_targeted: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setFormData({
            exercise_name: exercise.exercise_name || "",
            description: exercise.description || "",
            video_url: exercise.video_url || "",
            animation_url: exercise.animation_url || "",
            muscle_group_targeted: exercise.muscle_group_targeted || "",
        });
        setIsModalOpen(true);
    };

    const openViewModal = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsDeleteModalOpen(true);
    };

    const columns: Column<Exercise>[] = [
        {
            key: "animation_url",
            label: "Preview",
        },
        {
            key: "exercise_name",
            label: "Name",
            sortable: true,
        },
        {
            key: "muscle_group_targeted",
            label: "Muscle Group",
            sortable: true,
            render: (exercise) => (
                <span className="admin-tag purple">
                    {exercise.muscle_group_targeted || "-"}
                </span>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (exercise) =>
                exercise.description
                    ? exercise.description.substring(0, 50) + "..."
                    : "-",
        },
        {
            key: "created_at",
            label: "Created",
            sortable: true,
        },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header
                    title="Exercises"
                    subtitle="Manage exercise library and movements"
                />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={exercises}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        onRefresh={() => fetchExercises(true)}
                        searchPlaceholder="Search exercises..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedExercise ? "Edit Exercise" : "Add New Exercise"}
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
                            {selectedExercise ? "Update" : "Create"}
                        </button>
                    </>
                }
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Exercise Name *</label>
                        <input
                            type="text"
                            name="exercise_name"
                            value={formData.exercise_name}
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
                        <label className="admin-form-label">Muscle Group Targeted</label>
                        <select
                            name="muscle_group_targeted"
                            value={formData.muscle_group_targeted}
                            onChange={handleInputChange}
                            className="admin-form-select"
                        >
                            <option value="">Select Muscle Group</option>
                            <option value="Chest">Chest</option>
                            <option value="Back">Back</option>
                            <option value="Shoulders">Shoulders</option>
                            <option value="Arms">Arms</option>
                            <option value="Legs">Legs</option>
                            <option value="Core">Core</option>
                            <option value="Full Body">Full Body</option>
                            <option value="Cardio">Cardio</option>
                        </select>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Video URL</label>
                            <input
                                type="url"
                                name="video_url"
                                value={formData.video_url}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Animation URL</label>
                            <input
                                type="url"
                                name="animation_url"
                                value={formData.animation_url}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Exercise Details"
                size="lg"
            >
                {selectedExercise && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
                                {selectedExercise.exercise_name}
                            </h3>
                            {selectedExercise.muscle_group_targeted && (
                                <span className="admin-tag purple">
                                    {selectedExercise.muscle_group_targeted}
                                </span>
                            )}
                        </div>

                        {selectedExercise.description && (
                            <div>
                                <h4 style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "8px" }}>
                                    Description
                                </h4>
                                <p style={{ lineHeight: 1.6 }}>{selectedExercise.description}</p>
                            </div>
                        )}

                        {selectedExercise.video_url && (
                            <div>
                                <h4 style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "8px" }}>
                                    Video
                                </h4>
                                <a
                                    href={selectedExercise.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-btn admin-btn-secondary"
                                >
                                    Watch Video
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Exercise"
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
                    <strong>{selectedExercise?.exercise_name}</strong>?
                </p>
            </Modal>
        </>
    );
}