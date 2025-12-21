"use client";

import { useState } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    RefreshCw,
} from "lucide-react";
import Image from "next/image";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onAdd?: () => void;
    onRefresh?: () => void;
    searchPlaceholder?: string;
    title?: string;
    itemsPerPage?: number;
}

export default function DataTable<T>({
    columns,
    data,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onAdd,
    onRefresh,
    searchPlaceholder = "Search...",
    title,
    itemsPerPage = 10,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Filter data based on search
    const filteredData = data.filter((item) => {
        const itemObj = item as Record<string, unknown>;
        return Object.values(itemObj).some((value) =>
            String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Sort data
    const sortedData = sortColumn
        ? [...filteredData].sort((a, b) => {
            const aObj = a as Record<string, unknown>;
            const bObj = b as Record<string, unknown>;
            const aVal = aObj[sortColumn];
            const bVal = bObj[sortColumn];
            const direction = sortDirection === "asc" ? 1 : -1;

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (typeof aVal === "string" && typeof bVal === "string") {
                return aVal.localeCompare(bVal) * direction;
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return (aVal - bVal) * direction;
            }
            return String(aVal).localeCompare(String(bVal)) * direction;
        })
        : filteredData;

    // Paginate
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    const getNestedValue = (obj: Record<string, unknown>, key: string): unknown => {
        return key.split('.').reduce((acc: unknown, part: string) => {
            if (acc && typeof acc === 'object') {
                return (acc as Record<string, unknown>)[part];
            }
            return undefined;
        }, obj);
    };

    const renderCellValue = (item: T, column: Column<T>) => {
        if (column.render) {
            return column.render(item);
        }

        const itemObj = item as Record<string, unknown>;
        const value = getNestedValue(itemObj, column.key as string);

        // Handle image URLs
        const keyStr = String(column.key);
        if (
            typeof value === "string" &&
            (keyStr.includes("image") ||
                keyStr.includes("url") ||
                keyStr.includes("picture") ||
                keyStr.includes("icon"))
        ) {
            if (value && value.startsWith("http")) {
                return (
                    <Image
                        src={value}
                        alt=""
                        width={48}
                        height={48}
                        className="admin-table-avatar"
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                        }}
                    />
                );
            }
            return (
                <div
                    className="admin-table-avatar"
                    style={{
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontSize: "0.75rem",
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                    }}
                >
                    N/A
                </div>
            );
        }

        // Handle booleans
        if (typeof value === "boolean") {
            return (
                <span className={`admin-tag ${value ? "green" : "red"}`}>
                    {value ? "Yes" : "No"}
                </span>
            );
        }

        // Handle dates
        if (keyStr.includes("created_at") || keyStr.includes("updated_at") || keyStr.includes("date")) {
            if (value) {
                return new Date(String(value)).toLocaleDateString();
            }
        }

        return value != null ? String(value) : "-";
    };

    return (
        <div className="admin-card">
            {/* Header */}
            <div className="admin-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {title && <h3 className="admin-card-title">{title}</h3>}
                    <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        {filteredData.length} items
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Search */}
                    <div
                        className="admin-search"
                        style={{ width: "240px", background: "#f8fafc" }}
                    >
                        <Search size={16} color="#64748b" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ border: "none", background: "none", outline: "none", flex: 1 }}
                        />
                    </div>

                    {onRefresh && (
                        <button
                            className="admin-btn admin-btn-secondary admin-btn-icon"
                            onClick={onRefresh}
                            title="Refresh"
                        >
                            <RefreshCw size={18} />
                        </button>
                    )}

                    {onAdd && (
                        <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                            <Plus size={18} />
                            Add New
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-state-icon">
                            <Search size={32} />
                        </div>
                        <h3 className="admin-empty-state-title">No results found</h3>
                        <p className="admin-empty-state-text">
                            Try adjusting your search or add a new item
                        </p>
                        {onAdd && (
                            <button className="admin-btn admin-btn-primary" onClick={onAdd}>
                                <Plus size={18} />
                                Add New
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        onClick={() =>
                                            column.sortable && handleSort(String(column.key))
                                        }
                                        style={{
                                            cursor: column.sortable ? "pointer" : "default",
                                            userSelect: "none",
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            {column.label}
                                            {sortColumn === column.key && (
                                                <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </span>
                                    </th>
                                ))}
                                {(onView || onEdit || onDelete) && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index}>
                                    {columns.map((column) => (
                                        <td key={String(column.key)}>
                                            {renderCellValue(item, column)}
                                        </td>
                                    ))}
                                    {(onView || onEdit || onDelete) && (
                                        <td>
                                            <div className="admin-actions">
                                                {onView && (
                                                    <button
                                                        className="admin-action-btn view"
                                                        onClick={() => onView(item)}
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() => onEdit(item)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => onDelete(item)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <span className="admin-pagination-info">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
                        {sortedData.length} entries
                    </span>
                    <div className="admin-pagination-buttons">
                        <button
                            className="admin-pagination-btn"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`admin-pagination-btn ${currentPage === pageNum ? "active" : ""
                                        }`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            className="admin-pagination-btn"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}