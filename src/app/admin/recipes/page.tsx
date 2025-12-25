"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { supabase, Recipe } from "@/lib/supabase";
import { isViewerRole } from "@/lib/auth";

export default function RecipesPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [formData, setFormData] = useState({
        recipe_name: "",
        description: "",
        prep_time: "",
        cook_time: "",
        difficulty: "Easy",
        servings: "4",
        calories_per_serving: "",
        protein_per_serving: "",
        carbs_per_serving: "",
        fat_per_serving: "",
        ingredients: "",
        instructions: "",
        image_url: "",
        cuisine: "",
        is_sri_lankan: false,
    });

    const fetchRecipes = async (isReload = false) => {
        if (isReload) setLoading(true);
        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch recipes");
        } else {
            setRecipes(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRecipes();
    }, []);

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

        const recipeData = {
            recipe_name: formData.recipe_name,
            description: formData.description || null,
            prep_time: parseInt(formData.prep_time),
            cook_time: parseInt(formData.cook_time),
            difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
            servings: parseInt(formData.servings),
            calories_per_serving: parseInt(formData.calories_per_serving),
            protein_per_serving: parseFloat(formData.protein_per_serving),
            carbs_per_serving: parseFloat(formData.carbs_per_serving),
            fat_per_serving: parseFloat(formData.fat_per_serving),
            ingredients: formData.ingredients.split("\n").filter((i) => i.trim()),
            instructions: formData.instructions.split("\n").filter((i) => i.trim()),
            image_url: formData.image_url || null,
            cuisine: formData.cuisine || null,
            is_sri_lankan: formData.is_sri_lankan,
        };

        if (selectedRecipe) {
            const { error } = await supabase
                .from("recipes")
                .update(recipeData)
                .eq("recipe_id", selectedRecipe.recipe_id);

            if (error) {
                toast.error("Failed to update recipe");
            } else {
                toast.success("Recipe updated successfully");
                setIsModalOpen(false);
                fetchRecipes(true);
            }
        } else {
            const { error } = await supabase.from("recipes").insert([recipeData]);

            if (error) {
                toast.error("Failed to create recipe");
                console.error(error);
            } else {
                toast.success("Recipe created successfully");
                setIsModalOpen(false);
                fetchRecipes(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedRecipe) return;

        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq("recipe_id", selectedRecipe.recipe_id);

        if (error) {
            toast.error("Failed to delete recipe");
        } else {
            toast.success("Recipe deleted successfully");
            setIsDeleteModalOpen(false);
            fetchRecipes(true);
        }
    };

    const openAddModal = () => {
        setSelectedRecipe(null);
        setFormData({
            recipe_name: "",
            description: "",
            prep_time: "",
            cook_time: "",
            difficulty: "Easy",
            servings: "4",
            calories_per_serving: "",
            protein_per_serving: "",
            carbs_per_serving: "",
            fat_per_serving: "",
            ingredients: "",
            instructions: "",
            image_url: "",
            cuisine: "",
            is_sri_lankan: false,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setFormData({
            recipe_name: recipe.recipe_name,
            description: recipe.description || "",
            prep_time: recipe.prep_time?.toString() || "",
            cook_time: recipe.cook_time?.toString() || "",
            difficulty: recipe.difficulty,
            servings: recipe.servings?.toString() || "4",
            calories_per_serving: recipe.calories_per_serving?.toString() || "",
            protein_per_serving: recipe.protein_per_serving?.toString() || "",
            carbs_per_serving: recipe.carbs_per_serving?.toString() || "",
            fat_per_serving: recipe.fat_per_serving?.toString() || "",
            ingredients: recipe.ingredients?.join("\n") || "",
            instructions: recipe.instructions?.join("\n") || "",
            image_url: recipe.image_url || "",
            cuisine: recipe.cuisine || "",
            is_sri_lankan: recipe.is_sri_lankan,
        });
        setIsModalOpen(true);
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy":
                return "green";
            case "Medium":
                return "orange";
            case "Hard":
                return "red";
            default:
                return "blue";
        }
    };

    const columns: Column<Recipe>[] = [
        { key: "image_url", label: "Image" },
        { key: "recipe_name", label: "Name", sortable: true },
        {
            key: "difficulty",
            label: "Difficulty",
            render: (r) => (
                <span className={`admin-tag ${getDifficultyColor(r.difficulty)}`}>
                    {r.difficulty}
                </span>
            ),
        },
        {
            key: "prep_time",
            label: "Time",
            render: (r) => `${(r.prep_time || 0) + (r.cook_time || 0)} min`,
        },
        {
            key: "calories_per_serving",
            label: "Calories",
            render: (r) => `${r.calories_per_serving} kcal`,
        },
        { key: "cuisine", label: "Cuisine", render: (r) => r.cuisine || "-" },
        {
            key: "is_sri_lankan",
            label: "Sri Lankan",
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
                <Header title="Recipes" subtitle="Manage healthy recipes" onMenuClick={toggleMobileMenu} />

                <div className="admin-content">
                    <DataTable
                        columns={columns}
                        data={recipes}
                        loading={loading}
                        onAdd={openAddModal}
                        onView={(r) => {
                            setSelectedRecipe(r);
                            setIsViewModalOpen(true);
                        }}
                        onEdit={openEditModal}
                        onDelete={(r) => {
                            setSelectedRecipe(r);
                            setIsDeleteModalOpen(true);
                        }}
                        onRefresh={() => fetchRecipes(true)}
                        searchPlaceholder="Search recipes..."
                        readOnly={isViewerRole()}
                    />
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedRecipe ? "Edit Recipe" : "Add New Recipe"}
                size="xl"
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
                            {selectedRecipe ? "Update" : "Create"}
                        </button>
                    </>
                }
            >
                <form className="admin-form">
                    <div className="admin-form-group">
                        <label className="admin-form-label">Recipe Name *</label>
                        <input
                            type="text"
                            name="recipe_name"
                            value={formData.recipe_name}
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
                            rows={2}
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Prep Time (min) *</label>
                            <input
                                type="number"
                                name="prep_time"
                                value={formData.prep_time}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Cook Time (min) *</label>
                            <input
                                type="number"
                                name="cook_time"
                                value={formData.cook_time}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Difficulty *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="admin-form-select"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Servings *</label>
                            <input
                                type="number"
                                name="servings"
                                value={formData.servings}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Calories/Serving *</label>
                            <input
                                type="number"
                                name="calories_per_serving"
                                value={formData.calories_per_serving}
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
                                name="protein_per_serving"
                                value={formData.protein_per_serving}
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
                                name="carbs_per_serving"
                                value={formData.carbs_per_serving}
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
                                name="fat_per_serving"
                                value={formData.fat_per_serving}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Ingredients (one per line) *</label>
                        <textarea
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleInputChange}
                            className="admin-form-textarea"
                            rows={5}
                            placeholder="1 cup rice&#10;2 eggs&#10;..."
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Instructions (one per line) *</label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            className="admin-form-textarea"
                            rows={5}
                            placeholder="Preheat oven to 350°F&#10;Mix ingredients...&#10;..."
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
                            <label className="admin-form-label">Cuisine</label>
                            <input
                                type="text"
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleInputChange}
                                className="admin-form-input"
                                placeholder="e.g., Italian, Asian"
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-checkbox">
                            <input
                                type="checkbox"
                                name="is_sri_lankan"
                                checked={formData.is_sri_lankan}
                                onChange={handleInputChange}
                            />
                            <span>Sri Lankan Recipe</span>
                        </label>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Recipe Details"
                size="lg"
            >
                {selectedRecipe && (
                    <div>
                        {selectedRecipe.image_url && (
                            <Image
                                src={selectedRecipe.image_url}
                                alt={selectedRecipe.recipe_name}
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
                            {selectedRecipe.recipe_name}
                        </h3>
                        <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
                            <span className={`admin-tag ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                                {selectedRecipe.difficulty}
                            </span>
                            <span className="admin-tag blue">
                                <Clock size={14} style={{ marginRight: "4px" }} />
                                {(selectedRecipe.prep_time || 0) + (selectedRecipe.cook_time || 0)} min
                            </span>
                            <span className="admin-tag purple">
                                <Users size={14} style={{ marginRight: "4px" }} />
                                {selectedRecipe.servings} servings
                            </span>
                        </div>

                        {selectedRecipe.description && (
                            <p style={{ color: "#64748b", marginBottom: "24px" }}>
                                {selectedRecipe.description}
                            </p>
                        )}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "12px",
                                marginBottom: "24px",
                            }}
                        >
                            <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f97316" }}>
                                    {selectedRecipe.calories_per_serving}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Calories</div>
                            </div>
                            <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#22c55e" }}>
                                    {selectedRecipe.protein_per_serving}g
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Protein</div>
                            </div>
                            <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#3b82f6" }}>
                                    {selectedRecipe.carbs_per_serving}g
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Carbs</div>
                            </div>
                            <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#8b5cf6" }}>
                                    {selectedRecipe.fat_per_serving}g
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Fat</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>Ingredients</h4>
                            <ul style={{ paddingLeft: "20px" }}>
                                {selectedRecipe.ingredients?.map((ing, i) => (
                                    <li key={i} style={{ marginBottom: "4px" }}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>Instructions</h4>
                            <ol style={{ paddingLeft: "20px" }}>
                                {selectedRecipe.instructions?.map((step, i) => (
                                    <li key={i} style={{ marginBottom: "8px" }}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Recipe"
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
                    Are you sure you want to delete <strong>{selectedRecipe?.recipe_name}</strong>?
                </p>
            </Modal>
        </>
    );
}