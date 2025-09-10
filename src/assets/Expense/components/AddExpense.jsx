import React, { useState, useEffect } from "react";

function AddExpense({ categories = [], onAdd, isDarkMode }) {
  const initial = {
    title: "",
    amount: "",
    category: categories.length > 0 ? (categories[0].id || categories[0]) : "",
    date: new Date().toISOString().split("T")[0],
    type: "Ponctuelle",
    startDate: "",
    endDate: "",
    description: ""
  };

  const [expense, setExpense] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories[0].id ? categories[0].id : categories[0];
      setExpense(prev => ({ ...prev, category: defaultCategory }));
    }
  }, [categories]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!expense.title || !expense.amount || !expense.category) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const payload = {
        title: expense.title,
        amount: parseFloat(expense.amount),
        categoryId: parseInt(expense.category),
        type: expense.type,
        description: expense.description || ""
      };

      if (expense.type === "Ponctuelle") {
        payload.date = expense.date;
      } else if (expense.type === "Récurrente") {
        payload.startDate = expense.startDate;
        if (expense.endDate) payload.endDate = expense.endDate;
      }

      await onAdd(payload);
      setExpense(initial);
      setError("");
      alert("Dépense ajoutée avec succès !");
    } catch (error) {
      setError(error.message || "Erreur lors de l'ajout de la dépense");
    }
  };

  const containerClass = isDarkMode
    ? "p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg"
    : "p-6 max-w-3xl mx-auto bg-indigo-50 text-gray-900 rounded-2xl shadow-lg";

  const inputClass = isDarkMode
    ? "border border-gray-600 bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
    : "border border-gray-300 bg-white text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm";

  const buttonClass = isDarkMode
    ? "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-lg transition font-semibold"
    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg transition font-semibold";

  return (
    <div className={containerClass}>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Ajouter une dépense
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            name="title"
            type="text"
            placeholder="Titre *"
            value={expense.title}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Montant (€) *"
            value={expense.amount}
            onChange={handleChange}
            className={inputClass + " w-40"}
            required
          />
          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
            className={inputClass + " w-44"}
            required
          >
            {categories.map((category) => {
              const value = category.id ? category.id : category;
              const label = category.name ? category.name : category;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="Ponctuelle"
              checked={expense.type === "Ponctuelle"}
              onChange={handleChange}
              className="form-radio text-indigo-600"
            />
            Ponctuelle
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="Récurrente"
              checked={expense.type === "Récurrente"}
              onChange={handleChange}
              className="form-radio text-indigo-600"
            />
            Récurrente
          </label>
        </div>

        {expense.type === "Ponctuelle" && (
          <input
            name="date"
            type="date"
            value={expense.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        )}

        {expense.type === "Récurrente" && (
          <div className="flex gap-4">
            <input
              name="startDate"
              type="date"
              value={expense.startDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              name="endDate"
              type="date"
              value={expense.endDate}
              onChange={handleChange}
              className={inputClass}
              placeholder="Date de fin (optionnelle)"
            />
          </div>
        )}

        <input
          name="description"
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          className={inputClass + " w-full"}
        />

        <button type="submit" className={buttonClass}>
          Ajouter la dépense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;