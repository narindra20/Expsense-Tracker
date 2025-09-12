import React, { useState, useEffect } from "react";

function AddExpense({ categories = [], onAdd, isDarkMode }) {
  const initialExpense = {
    title: "",
    amount: "",
    category: categories[0]?.id || "",
    type: "Ponctuelle",
    date: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
    receipt: null,
  };

  const [expense, setExpense] = useState(initialExpense);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length) {
      setExpense(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setExpense({ ...expense, receipt: files[0] });
    } else {
      setExpense({ ...expense, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!expense.title || !expense.amount) {
      setError("Veuillez remplir le titre et le montant.");
      return;
    }

    const amount = parseFloat(expense.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Le montant doit être un nombre supérieur à 0.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Vous devez être connecté.");

      const formData = new FormData();
      formData.append("title", expense.title);
      formData.append("amount", amount);
      formData.append("categoryId", expense.category);
      formData.append("type", expense.type);
      formData.append("description", expense.description || "");
      
      if (expense.type === "Ponctuelle") formData.append("date", expense.date);
      else {
        formData.append("startDate", expense.startDate);
        if (expense.endDate) formData.append("endDate", expense.endDate);
      }

      if (expense.receipt) formData.append("receipt", expense.receipt);

      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      onAdd(data);
      setExpense(initialExpense);
    } catch (err) {
      setError("Erreur : " + err.message);
    }
  };

  const containerClass = isDarkMode
    ? "p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg"
    : "p-6 max-w-3xl mx-auto bg-indigo-50 text-gray-900 rounded-2xl shadow-lg";

  const inputClass = isDarkMode
    ? "border border-gray-600 bg-gray-700 text-white rounded-xl px-4 py-3"
    : "border border-gray-300 bg-white text-gray-900 rounded-xl px-4 py-3";

  const buttonClass = isDarkMode
    ? "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-lg"
    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg";

  return (
    <div className={containerClass}>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Ajouter une dépense</h2>

      {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Titre, montant, catégorie */}
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
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {/* Type : Ponctuelle ou Récurrente */}
        <div className="flex gap-6 items-center">
          {["Ponctuelle", "Récurrente"].map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value={type}
                checked={expense.type === type}
                onChange={handleChange}
              />
              {type}
            </label>
          ))}
        </div>

        {/* Dates selon type */}
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
          <div className="space-y-4">
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
            />
          </div>
        )}

        {/* Description et justificatif */}
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          className={inputClass + " w-full"}
        />
        <input
          type="file"
          name="receipt"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          className={inputClass}
        />

        <button type="submit" className={buttonClass}>Ajouter la dépense</button>
      </form>
    </div>
  );
}

export default AddExpense;
