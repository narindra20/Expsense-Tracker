import React, { useState } from "react";

function AddExpense({ categories, onAdd }) {
  const initial = {
    title: "",
    amount: "",
    category: categories[0] || "",
    date: new Date().toISOString().split("T")[0],
    type: "Ponctuelle",
    startDate: "",
    endDate: "",
    description: ""
  };

  const [expense, setExpense] = useState(initial);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.title || !expense.amount) return;

    onAdd({ ...expense, amount: parseFloat(expense.amount) });
    setExpense(initial);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Ajouter une dépense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            name="title"
            type="text"
            placeholder="Titre"
            value={expense.title}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            required
          />
          <input
            name="amount"
            type="number"
            placeholder="Montant (€)"
            value={expense.amount}
            onChange={handleChange}
            className="w-40 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            required
          />
          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
            className="w-44 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
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
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
              required
            />
            <input
              name="endDate"
              type="date"
              value={expense.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            />
          </div>
        )}

        <input
          name="description"
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm w-full transition"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 hover:from-indigo-500 hover:to-purple-500 transition transform font-semibold"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
