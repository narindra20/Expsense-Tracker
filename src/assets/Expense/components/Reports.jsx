import React from 'react';

function Reports({ expenses }) {
  // Calcul des dépenses par mois (exemple simplifié)
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7); // Format YYYY-MM
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Rapports et Statistiques</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Dépenses par Mois</h3>
        {Object.keys(monthlyExpenses).length === 0 ? (
          <p className="text-gray-500">Aucune donnée disponible.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(monthlyExpenses).map(([month, amount]) => (
              <div key={month}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{month}</span>
                  <span className="font-medium">{amount.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full" 
                    style={{ width: `${(amount / Math.max(...Object.values(monthlyExpenses))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Export des Données</h3>
        <p className="text-gray-600 mb-4">Téléchargez vos données au format CSV.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Exporter les Données
        </button>
      </div>
    </div>
  );
}

export default Reports;