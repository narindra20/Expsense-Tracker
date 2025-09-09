import React, { useState } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";

function Categories({ categories = [], setCategories }) {
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const addCategory = () => {
    const name = newCategory.trim();
    if (name && !categories.includes(name)) {
      setCategories([...categories, name]);
      setNewCategory("");
    }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setEditValue(cat);
  };

  const saveEdit = () => {
    const name = editValue.trim();
    if (name && !categories.includes(name)) {
      setCategories(categories.map((cat) => (cat === editing ? name : cat)));
      setEditing(null);
    }
  };

  const removeCategory = (cat) => setCategories(categories.filter((c) => c !== cat));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Catégories</h2>

      {/* Ajouter */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie"
          className="flex-grow border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-300"
        />
        <button
          onClick={addCategory}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
            {editing === cat ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-grow border rounded px-2 py-1 dark:bg-gray-600 dark:text-gray-300"
                  autoFocus
                />
                <button onClick={saveEdit} className="bg-green-600 px-2 rounded hover:bg-green-700 text-white">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(null)} className="bg-gray-500 px-2 rounded hover:bg-gray-600 text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-800 dark:text-gray-300">{cat}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(cat)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeCategory(cat)} className="text-red-600 hover:text-red-800 dark:text-red-400">
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
