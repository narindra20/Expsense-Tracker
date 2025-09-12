import React, { useState } from "react";

function AddIncome({ onAdd, isDarkMode }) {
  const initial = {
    title: "",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  };

  const [income, setIncome] = useState(initial);

  const handleChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!income.title || !income.amount || !income.source) {
      return alert("Veuillez remplir le titre, la source et le montant.");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Vous devez être connecté pour ajouter un revenu.");

    try {
      const response = await fetch("http://localhost:5000/api/incomes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: income.title,
          source: income.source,
          amount: parseFloat(income.amount),
          date: income.date,
          description: income.description || "",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      // ⚡ Passe uniquement l'objet income (data.income) à onAdd
      onAdd(data.income);
      setIncome(initial);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du revenu : " + err.message);
    }
  };

  const containerClass = isDarkMode
    ? "p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg"
    : "p-6 max-w-3xl mx-auto bg-indigo-50 text-gray-900 rounded-2xl shadow-lg";

  const inputClass = isDarkMode
    ? "border border-gray-600 bg-gray-700 text-white rounded-xl px-4 py-3"
    : "border border-gray-300 bg-white text-gray-900 rounded-xl px-4 py-3";

  const buttonClass = isDarkMode
    ? "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold"
    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold";

  return (
    <div className={containerClass}>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Ajouter un revenu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <input name="title" placeholder="Titre" value={income.title} onChange={handleChange} className={inputClass} required />
          <input name="source" placeholder="Source" value={income.source} onChange={handleChange} className={inputClass} required />
          <input name="amount" type="number" placeholder="Montant (€)" value={income.amount} onChange={handleChange} className={inputClass + " w-40"} required />
        </div>
        <input name="date" type="date" value={income.date} onChange={handleChange} className={inputClass} required />
        <input name="description" placeholder="Description" value={income.description} onChange={handleChange} className={inputClass + " w-full"} />
        <button type="submit" className={buttonClass}>Ajouter</button>
      </form>
    </div>
  );
}

export default AddIncome;
