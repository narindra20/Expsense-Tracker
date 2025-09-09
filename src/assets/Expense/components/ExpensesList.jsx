import React from "react";

function ExpensesList({ expenses, onDelete, isDarkMode }) {
  // Classes pour le dark/clair
  const containerClass = isDarkMode
    ? "bg-gray-800 text-white rounded-lg shadow overflow-hidden"
    : "bg-white text-gray-900 rounded-lg shadow overflow-hidden";

  const tableHeadClass = isDarkMode
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-50 text-gray-500";

  const rowBgClass = isDarkMode
    ? "divide-y divide-gray-600"
    : "divide-y divide-gray-200";

  const textTypePonctuelle = isDarkMode
    ? "bg-green-700 text-green-100 px-2 rounded-full text-xs"
    : "bg-green-100 text-green-800 px-2 rounded-full text-xs";

  const textTypeRecurrente = isDarkMode
    ? "bg-blue-700 text-blue-100 px-2 rounded-full text-xs"
    : "bg-blue-100 text-blue-800 px-2 rounded-full text-xs";

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
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4">{expense.title}</td>
                  <td className="px-6 py-4">{expense.category}</td>
                  <td className="px-6 py-4">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className={expense.type === "Ponctuelle" ? textTypePonctuelle : textTypeRecurrente}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">
                    {expense.amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpensesList;
