import React, { useState, useEffect } from "react";

function AddExpense({ categories = [], onAdd, isDarkMode }) {
  const initial = {
    title: "",
    amount: "",
    category: categories.length > 0 ? categories[0].id : "",
    date: new Date().toISOString().split("T")[0],
    type: "Ponctuelle",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: ""
  };

  const [expense, setExpense] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setExpense(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expense.title || !expense.amount) {
      setError("Veuillez remplir le titre et le montant.");
      return;
    }

    const amount = parseFloat(expense.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Le montant doit être un nombre valide supérieur à 0.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Vous devez être connecté.");

      const payload = {
        title: expense.title,
        amount,
        categoryId: expense.category,
        description: expense.description || "",
        type: expense.type,
        date: expense.type === "Ponctuelle" ? expense.date : null,
        startDate: expense.type === "Récurrente" ? expense.startDate : null,
        endDate: expense.type === "Récurrente" ? expense.endDate : null,
      };

      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      onAdd(data);
      setExpense(initial);
    } catch (err) {
      setError("Erreur lors de l'ajout : " + err.message);
    }
  };

  const containerClass = isDarkMode ? "p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg" : "p-6 max-w-3xl mx-auto bg-indigo-50 text-gray-900 rounded-2xl shadow-lg";
  const inputClass = isDarkMode ? "border border-gray-600 bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm" : "border border-gray-300 bg-white text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm";
  const buttonClass = isDarkMode ? "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-lg transition font-semibold" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg transition font-semibold";

  return (
    <div className={containerClass}>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Ajouter une dépense</h2>
      {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <input name="title" type="text" placeholder="Titre *" value={expense.title} onChange={handleChange} className={inputClass} required />
          <input name="amount" type="number" step="0.01" placeholder="Montant (€) *" value={expense.amount} onChange={handleChange} className={inputClass + " w-40"} required />
          <select name="category" value={expense.category} onChange={handleChange} className={inputClass + " w-44"} required>
            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>

        <div className="flex gap-6 items-center">
          <label><input type="radio" name="type" value="Ponctuelle" checked={expense.type === "Ponctuelle"} onChange={handleChange} className="form-radio text-indigo-600" /> Ponctuelle</label>
          <label><input type="radio" name="type" value="Récurrente" checked={expense.type === "Récurrente"} onChange={handleChange} className="form-radio text-indigo-600" /> Récurrente</label>
        </div>

        {expense.type === "Ponctuelle" && (
          <div>
            <label className="block mb-2">Date de la dépense *</label>
            <input name="date" type="date" value={expense.date} onChange={handleChange} className={inputClass} required />
          </div>
        )}  

        {expense.type === "Récurrente" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Date de début *</label>
              <input name="startDate" type="date" value={expense.startDate} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="block mb-2">Date de fin (optionnelle)</label>
              <input name="endDate" type="date" value={expense.endDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        <input name="description" type="text" placeholder="Description" value={expense.description} onChange={handleChange} className={inputClass + " w-full"} />
        <button type="submit" className={buttonClass}>Ajouter la dépense</button>
      </form>
    </div>
  );
}

export default AddExpense;
