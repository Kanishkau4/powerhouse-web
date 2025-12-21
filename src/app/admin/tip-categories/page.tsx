"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, TipCategory } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function TipCategoriesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categories, setCategories] = useState<TipCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    icon_name: "",
    color_hex: "#22c55e",
    description: "",
    sort_order: "0",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tip_categories")
      .select("*")
      .order("sort_order");

    if (error) {
      toast.error("Failed to fetch categories");
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name: formData.name.toLowerCase().replace(/\s+/g, "_"),
      display_name: formData.display_name,
      icon_name: formData.icon_name || null,
      color_hex: formData.color_hex,
      description: formData.description || null,
      sort_order: parseInt(formData.sort_order),
    };

    if (selectedCategory) {
      const { error } = await supabase
        .from("tip_categories")
        .update(categoryData)
        .eq("category_id", selectedCategory.category_id);

      if (error) {
        toast.error("Failed to update category");
      } else {
        toast.success("Category updated successfully");
        setIsModalOpen(false);
        fetchCategories();
      }
    } else {
      const { error } = await supabase.from("tip_categories").insert([categoryData]);

      if (error) {
        toast.error("Failed to create category");
      } else {
        toast.success("Category created successfully");
        setIsModalOpen(false);
        fetchCategories();
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    const { error } = await supabase
      .from("tip_categories")
      .delete()
      .eq("category_id", selectedCategory.category_id);

    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      fetchCategories();
    }
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({
      name: "",
      display_name: "",
      icon_name: "",
      color_hex: "#22c55e",
      description: "",
      sort_order: "0",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: TipCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      display_name: category.display_name,
      icon_name: category.icon_name || "",
      color_hex: category.color_hex || "#22c55e",
      description: category.description || "",
      sort_order: category.sort_order?.toString() || "0",
    });
    setIsModalOpen(true);
  };

  const columns: Column<TipCategory>[] = [
    {
      key: "color_hex",
      label: "Color",
      render: (cat) => (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            background: cat.color_hex || "#22c55e",
          }}
        />
      ),
    },
    { key: "display_name", label: "Display Name", sortable: true },
    { key: "name", label: "Slug" },
    { key: "icon_name", label: "Icon", render: (cat) => cat.icon_name || "-" },
    { key: "sort_order", label: "Order", sortable: true },
  ];

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`admin-main ${isCollapsed ? "expanded" : ""}`}>
        <Header title="Tip Categories" subtitle="Manage tip categories" />

        <div className="admin-content">
          <DataTable
            columns={columns}
            data={categories}
            loading={loading}
            onAdd={openAddModal}
            onEdit={openEditModal}
            onDelete={(cat) => {
              setSelectedCategory(cat);
              setIsDeleteModalOpen(true);
            }}
            onRefresh={fetchCategories}
            searchPlaceholder="Search categories..."
            readOnly={isViewerRole()}
          />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? "Edit Category" : "Add New Category"}
        footer={
          <>
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
              {selectedCategory ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <form className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Display Name *</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Slug (auto-generated)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="admin-form-input"
                placeholder="e.g., nutrition_tips"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Icon Name</label>
              <input
                type="text"
                name="icon_name"
                value={formData.icon_name}
                onChange={handleInputChange}
                className="admin-form-input"
                placeholder="e.g., apple, dumbbell"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Color</label>
              <input
                type="color"
                name="color_hex"
                value={formData.color_hex}
                onChange={handleInputChange}
                style={{ width: "100%", height: "46px", borderRadius: "12px" }}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="admin-form-textarea"
              rows={2}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              className="admin-form-input"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
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
          <strong>{selectedCategory?.display_name}</strong>?
        </p>
      </Modal>
    </>
  );
}