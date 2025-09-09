// /frontend/src/components/Categories.jsx
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Check, X, AlertCircle, Loader } from "lucide-react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/categories";
  const userId = 1; // Remplacer par récupération réelle du token si nécessaire

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur de chargement");
      const data = await response.json();
      setCategories(data);
    } catch {
      setError("Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) {
      setError("Le nom ne peut pas être vide");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, userId }),
      });
      if (!response.ok) throw new Error("Erreur d'ajout");
      setNewCategory("");
      setError("");
      fetchCategories();
    } catch {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateCategory = async () => {
    const name = editValue.trim();
    if (!name) {
      setError("Le nom ne peut pas être vide");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Erreur de modification");
      setEditing(null);
      setEditValue("");
      setError("");
      fetchCategories();
    } catch {
      setError("Erreur lors de la modification");
    }
  };

  const removeCategory = async (cat) => {
    if (!window.confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${cat.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur de suppression");
      fetchCategories();
      setError("");
    } catch {
      setError("Impossible de supprimer la catégorie");
    }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setEditValue(cat.name);
  };
  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Catégories
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setError("");
          }}
          placeholder="Nouvelle catégorie"
          className="flex-grow border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          onKeyPress={(e) => e.key === "Enter" && addCategory()}
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
          >
            {editing && editing.id === cat.id ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);
                    setError("");
                  }}
                  className="flex-grow border rounded px-2 py-1 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") updateCategory();
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
                <button
                  onClick={updateCategory}
                  className="bg-green-600 px-2 rounded hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 px-2 rounded hover:bg-gray-600 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-800 dark:text-gray-300">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeCategory(cat)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Vous n'avez pas encore de catégories. Ajoutez-en une !
        </div>
      )}
    </div>
  );
}

export default Categories;
