import React, { useState } from "react";

function IncomesList({ incomes = [], onDelete, onUpdate, isDarkMode }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Classes dynamiques selon le thème
  const containerClass = isDarkMode
    ? "bg-gray-800 text-white rounded-lg shadow overflow-hidden"
    : "bg-white text-gray-900 rounded-lg shadow overflow-hidden";

  const tableHeadClass = isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500";
  const rowBgClass = isDarkMode ? "divide-y divide-gray-600" : "divide-y divide-gray-200";

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { amount: parseFloat(editData.amount) };

      const res = await fetch(`http://localhost:5000/api/incomes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      onUpdate(data);
      setEditId(null);
      setEditData({});
    } catch (err) {
      alert("Erreur lors de la modification : " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/incomes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      onDelete(id);
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  if (incomes.length === 0) {
    return (
      <div className={`p-8 rounded-lg shadow text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-500"}`}>
        Aucun revenu enregistré.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Mes Revenus</h2>
      <div className={containerClass}>
        <table className="min-w-full">
          <thead className={tableHeadClass}>
            <tr>
              {["Titre", "Date", "Montant", "Actions"].map((title) => (
                <th key={title} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody className={rowBgClass}>
            {incomes.map((income) => (
              <tr key={income.id}>
                {editId === income.id ? (
                  <>
                    <td className="px-6 py-4">{income.title}</td>
                    <td className="px-6 py-4">{new Date(income.date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount || ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full text-black"
                      />
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleSave(income.id)} className="bg-green-500 text-white px-3 py-1 rounded">Sauvegarder</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{income.title}</td>
                    <td className="px-6 py-4">{new Date(income.date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{income.amount.toFixed(2)} €</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => { setEditId(income.id); setEditData({ amount: income.amount }); }} className="text-blue-600 hover:text-blue-900">Modifier</button>
                      <button onClick={() => handleDelete(income.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IncomesList;
