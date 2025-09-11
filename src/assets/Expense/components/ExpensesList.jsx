import React, { useState } from "react";

function ExpensesList({ expenses, onDelete, onUpdate, categories, isDarkMode }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const containerClass = isDarkMode ? "bg-gray-800 text-white rounded-lg shadow overflow-hidden" : "bg-white text-gray-900 rounded-lg shadow overflow-hidden";
  const tableHeadClass = isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500";
  const rowBgClass = isDarkMode ? "divide-y divide-gray-600" : "divide-y divide-gray-200";
  const textTypePonctuelle = isDarkMode ? "bg-green-700 text-green-100 px-2 rounded-full text-xs" : "bg-green-100 text-green-800 px-2 rounded-full text-xs";
  const textTypeRecurrente = isDarkMode ? "bg-blue-700 text-blue-100 px-2 rounded-full text-xs" : "bg-blue-100 text-blue-800 px-2 rounded-full text-xs";

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { amount: parseFloat(editData.amount) };
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");
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
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      onDelete(id);
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  // Fonction pour afficher la date correctement
  const getDisplayDate = (expense) => {
    if (expense.type && expense.type.toLowerCase() === "recurrente") {
      return expense.startDate ? new Date(expense.startDate).toLocaleDateString('fr-FR') : "Non définie";
    } else {
      return expense.date ? new Date(expense.date).toLocaleDateString('fr-FR') : "Non définie";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Mes Dépenses</h2>
      {expenses.length === 0 ? (
        <div className={`p-8 rounded-lg shadow text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-500"}`}>
          Aucune dépense enregistrée.
        </div>
      ) : (
        <div className={containerClass}>
          <table className="min-w-full">
            <thead className={tableHeadClass}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={rowBgClass}>
              {expenses.map((expense) => {
                const displayDate = getDisplayDate(expense);

                return (
                  <tr key={expense.id}>
                    {editId === expense.id ? (
                      <>
                        <td className="px-6 py-4">{expense.title}</td>
                        <td className="px-6 py-4">{expense.category ? expense.category.name : "Inconnue"}</td>
                        <td className="px-6 py-4">{displayDate}</td>
                        <td className="px-6 py-4">
                        <span className={expense.type === "Ponctuelle" ? textTypePonctuelle : textTypeRecurrente}>
                            {expense.type}
                        </span>
                        </td>
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
                          <button onClick={() => handleSave(expense.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                            Sauvegarder
                          </button>
                          <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                            Annuler
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{expense.title}</td>
                        {/*Nom de la catégories*/}
                        <td className="px-6 py-4">{expense.category ? expense.category.name : "Inconnue"}</td>
                        <td className="px-6 py-4">{displayDate}</td>
                        <td className="px-6 py-4">
                          <span className={expense.type.toLowerCase() === "ponctuelle" ? textTypePonctuelle : textTypeRecurrente}>
                            {expense.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-red-600 font-medium">{expense.amount.toFixed(2)} €</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button 
                            onClick={() => { 
                              setEditId(expense.id); 
                              setEditData({ amount: expense.amount }); 
                            }} 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDelete(expense.id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpensesList;