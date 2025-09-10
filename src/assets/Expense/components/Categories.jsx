import React, { useState } from "react";
import { Edit, Trash2, Check, X, AlertCircle } from "lucide-react";

function Categories({ categories, setCategories, refreshCategories, isDarkMode }) {
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/categories";
  const userId = 1;

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return setError("Nom requis");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, userId }),
      });
      if (!res.ok) throw new Error("Erreur ajout");
      setNewCategory("");
      await refreshCategories(); // 🔑 recharge liste
    } catch {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateCategory = async () => {
    const name = editValue.trim();
    if (!name) return setError("Nom requis");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Erreur modif");
      setEditing(null);
      setEditValue("");
      await refreshCategories();
    } catch {
      setError("Erreur lors de la modification");
    }
  };

  const removeCategory = async (cat) => {
    if (!window.confirm(`Supprimer "${cat.name}" ?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${cat.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      await refreshCategories();
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Catégories</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie"
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            {editing && editing.id === cat.id ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-grow border rounded px-2 py-1"
                />
                <button onClick={updateCategory} className="bg-green-600 px-2 rounded text-white">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(null)} className="bg-gray-500 px-2 rounded text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(cat); setEditValue(cat.name); }} className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeCategory(cat)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
