import React from 'react';

function Dashboard({ expenses, totalExpenses }) {
  // Dépenses par catégorie
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Tableau de Bord</h2>
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total des Dépenses</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalExpenses.toFixed(2)} €</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nombre de Dépenses</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{expenses.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Dépense Moyenne</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {expenses.length ? (totalExpenses / expenses.length).toFixed(2) : 0} €
          </p>
        </div>
      </div>
      
      {/* Dépenses par catégorie */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Dépenses par Catégorie</h3>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
                <span className="font-medium dark:text-gray-300">{amount.toFixed(2)} €</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(amount / totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dernières dépenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Dernières Dépenses</h3>
        {expenses.slice(0, 5).map(expense => (
          <div key={expense.id} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-medium dark:text-gray-300">{expense.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} • {expense.date}</p>
            </div>
            <span className="text-red-600 dark:text-red-400 font-medium">{expense.amount.toFixed(2)} €</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;