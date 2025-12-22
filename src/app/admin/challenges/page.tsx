"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Calendar } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Challenge } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function ChallengesPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        challenge_name: "",
        description: "",
        target_value: "",
        unit: "",
        duration_days: "",
        xp_reward: "",
        challenge_type: "physical",
        image_url: "",
        start_date: "",
        end_date: "",
    });

    const fetchChallenges = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("challenges")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch challenges");
            console.error(error);
        } else {
            setChallenges(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChallenges();
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

        const challengeData = {
            challenge_name: formData.challenge_name,
            description: formData.description || null,
            target_value: formData.target_value ? parseInt(formData.target_value) : null,
            unit: formData.unit || null,
            duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
            xp_reward: formData.xp_reward ? parseInt(formData.xp_reward) : 0,
            challenge_type: formData.challenge_type,
            image_url: formData.image_url || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
        };

        if (selectedChallenge) {
            const { error } = await supabase
                .from("challenges")
                .update(challengeData)
                .eq("challenge_id", selectedChallenge.challenge_id);

            if (error) {
                toast.error("Failed to update challenge");
                console.error(error);
            } else {
                toast.success("Challenge updated successfully");
                setIsModalOpen(false);
                fetchChallenges(true);
            }
        } else {
            const { error } = await supabase.from("challenges").insert([challengeData]);

            if (error) {
                toast.error("Failed to create challenge");
                console.error(error);
            } else {
                toast.success("Challenge created successfully");
                setIsModalOpen(false);
                fetchChallenges(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedChallenge) return;

        const { error } = await supabase
            .from("challenges")
            .delete()
            .eq("challenge_id", selectedChallenge.challenge_id);

        if (error) {
            toast.error("Failed to delete challenge");
            console.error(error);
        } else {
            toast.success("Challenge deleted successfully");
            setIsDeleteModalOpen(false);
            fetchChallenges(true);
        }
    };

    const openAddModal = () => {
        setSelectedChallenge(null);
        setFormData({
            challenge_name: "",
            description: "",
            target_value: "",
            unit: "",
            duration_days: "",
            xp_reward: "",
            challenge_type: "physical",
            image_url: "",
            start_date: "",
            end_date: "",
        });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setFormData({
            challenge_name: challenge.challenge_name || "",
            description: challenge.description || "",
            target_value: challenge.target_value?.toString() || "",
            unit: challenge.unit || "",
            duration_days: challenge.duration_days?.toString() || "",
            xp_reward: challenge.xp_reward?.toString() || "",
            challenge_type: challenge.challenge_type || "physical",
            image_url: challenge.image_url || "",
            start_date: challenge.start_date?.split("T")[0] || "",
            end_date: challenge.end_date?.split("T")[0] || "",
        });
        setImagePreview(challenge.image_url || null);
        setIsModalOpen(true);
    };

    const openViewModal = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setIsViewModalOpen(true);
    };

    const openDeleteModal = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setIsDeleteModalOpen(true);
    };

    const getChallengeTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case "physical":
                return "green";
            case "nutrition":
                return "orange";
            case "mental":
                return "purple";
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
            key: "challenge_name",
            label: "Name",
            sortable: true,
        },
        {
            key: "challenge_type",
            label: "Type",
            sortable: true,
            render: (challenge: Challenge) => (
                <span className={`admin-tag ${getChallengeTypeColor(challenge.challenge_type)}`}>
                    {challenge.challenge_type}
                </span>
            ),
        },
        {
            key: "target_value",
            label: "Target",
            render: (challenge: Challenge) =>
                challenge.target_value
                    ? `${challenge.target_value} ${challenge.unit || ""}`
                    : "-",
        },
        {
            key: "duration_days",
            label: "Duration",
            sortable: true,
            render: (challenge: Challenge) =>
                challenge.duration_days ? `${challenge.duration_days} days` : "-",
        },
        {
            key: "xp_reward",
            label: "XP Reward",
            sortable: true,
            render: (challenge: Challenge) => (
                <span style={{ fontWeight: 600, color: "#f97316" }}>
                    {challenge.xp_reward} XP
                </span>
            ),
        },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header
                    title="Challenges"
                    subtitle="Create and manage fitness challenges"
                />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={challenges}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        onRefresh={() => fetchChallenges(true)}
                        searchPlaceholder="Search challenges..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedChallenge ? "Edit Challenge" : "Add New Challenge"}
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
                            {selectedChallenge ? "Update Challenge" : "Create Challenge"}
                        </button>
                    </>
                }
            >
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Challenge Name *</label>
                        <input
                            type="text"
                            name="challenge_name"
                            value={formData.challenge_name}
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
                            <label className="admin-form-label">Challenge Type</label>
                            <select
                                name="challenge_type"
                                value={formData.challenge_type}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="physical">Physical</option>
                                <option value="nutrition">Nutrition</option>
                                <option value="mental">Mental</option>
                                <option value="social">Social</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">XP Reward</label>
                            <input
                                type="number"
                                name="xp_reward"
                                value={formData.xp_reward}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Target Value</label>
                            <input
                                type="number"
                                name="target_value"
                                value={formData.target_value}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Unit</label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                placeholder="e.g., steps, km, minutes"
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Duration (days)</label>
                            <input
                                type="number"
                                name="duration_days"
                                value={formData.duration_days}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
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
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="admin-form-input"
                            />
                        </div>
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
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Challenge Details"
                size="lg"
            >
                {selectedChallenge && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {selectedChallenge.image_url && (
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
                                    src={selectedChallenge.image_url}
                                    alt={selectedChallenge.challenge_name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        )}

                        <div>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
                                {selectedChallenge.challenge_name}
                            </h3>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                <span className={`admin-tag ${getChallengeTypeColor(selectedChallenge.challenge_type)}`}>
                                    {selectedChallenge.challenge_type}
                                </span>
                                <span className="admin-tag orange">{selectedChallenge.xp_reward} XP</span>
                            </div>
                            {selectedChallenge.description && (
                                <p style={{ color: "#64748b", lineHeight: 1.6 }}>
                                    {selectedChallenge.description}
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "16px",
                            }}
                        >
                            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>
                                    Target
                                </div>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                    {selectedChallenge.target_value
                                        ? `${selectedChallenge.target_value} ${selectedChallenge.unit || ""}`
                                        : "-"}
                                </div>
                            </div>
                            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>
                                    Duration
                                </div>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                    {selectedChallenge.duration_days
                                        ? `${selectedChallenge.duration_days} days`
                                        : "-"}
                                </div>
                            </div>
                            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>
                                    XP Reward
                                </div>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f97316" }}>
                                    {selectedChallenge.xp_reward} XP
                                </div>
                            </div>
                        </div>

                        {(selectedChallenge.start_date || selectedChallenge.end_date) && (
                            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                <Calendar size={20} style={{ color: "#64748b" }} />
                                <span style={{ color: "#64748b" }}>
                                    {selectedChallenge.start_date &&
                                        new Date(selectedChallenge.start_date).toLocaleDateString()}
                                    {selectedChallenge.start_date && selectedChallenge.end_date && " - "}
                                    {selectedChallenge.end_date &&
                                        new Date(selectedChallenge.end_date).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Challenge"
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
                    <strong>{selectedChallenge?.challenge_name}</strong>? This action cannot
                    be undone.
                </p>
            </Modal>
        </>
    );
}