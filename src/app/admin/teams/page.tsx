"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Team } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function TeamsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const fetchTeams = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("teams")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch teams");
        } else {
            setTeams(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTeams();
    }, []);

    const handleDelete = async () => {
        if (!selectedTeam) return;

        const { error } = await supabase
            .from("teams")
            .delete()
            .eq("team_id", selectedTeam.team_id);

        if (error) {
            toast.error("Failed to delete team");
        } else {
            toast.success("Team deleted successfully");
            setIsDeleteModalOpen(false);
            fetchTeams(true);
        }
    };

    const columns: Column<Team>[] = [
        { key: "image_url", label: "Image" },
        { key: "team_name", label: "Name", sortable: true },
        {
            key: "member_count",
            label: "Members",
            sortable: true,
            render: (team) => (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Users size={16} />
                    {team.member_count}
                </span>
            ),
        },
        {
            key: "total_xp",
            label: "Total XP",
            sortable: true,
            render: (team) => (
                <span style={{ fontWeight: 600, color: "#f97316" }}>
                    {team.total_xp?.toLocaleString()} XP
                </span>
            ),
        },
        { key: "created_at", label: "Created", sortable: true },
    ];

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
                <Header title="Teams" subtitle="View and manage user teams" />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={teams}
                        loading={loading}
                        onView={(team) => {
                            setSelectedTeam(team);
                            setIsViewModalOpen(true);
                        }}
                        onDelete={(team) => {
                            setSelectedTeam(team);
                            setIsDeleteModalOpen(true);
                        }}
                        onRefresh={() => fetchTeams(true)}
                        searchPlaceholder="Search teams..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Team Details"
            >
                {selectedTeam && (
                    <div style={{ textAlign: "center" }}>
                        {selectedTeam.image_url && (
                            <Image
                                src={selectedTeam.image_url}
                                alt={selectedTeam.team_name}
                                width={120}
                                height={120}
                                style={{ borderRadius: "24px", marginBottom: "24px" }}
                            />
                        )}
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                            {selectedTeam.team_name}
                        </h3>
                        {selectedTeam.description && (
                            <p style={{ color: "#64748b", marginTop: "8px" }}>
                                {selectedTeam.description}
                            </p>
                        )}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "24px",
                                marginTop: "24px",
                            }}
                        >
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                                    {selectedTeam.member_count}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Members</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f97316" }}>
                                    {selectedTeam.total_xp?.toLocaleString()}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total XP</div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Team"
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
                    Are you sure you want to delete <strong>{selectedTeam?.team_name}</strong>?
                </p>
            </Modal>
        </>
    );
}