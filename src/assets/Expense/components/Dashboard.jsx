import React, { useState } from 'react';

function Dashboard({ expenses = [], incomes = [], categories = [], currentMonth = new Date() }) {
  // S'assurer que les props ont des valeurs par défaut pour éviter les erreurs
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeIncomes = Array.isArray(incomes) ? incomes : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  // Utiliser le mois courant si currentMonth n'est pas fourni
  const currentDate = currentMonth instanceof Date ? currentMonth : new Date();
  
  // Calculer le total des revenus du mois
  const totalIncome = safeIncomes
    .filter(income => {
      if (!income || !income.date) return false;
      
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentDate.getMonth() && 
             incomeDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((total, income) => total + (parseFloat(income.amount) || 0), 0);

  // Calculer le total des dépenses du mois (ponctuelles + récurrentes actives)
  const totalExpenses = safeExpenses
    .filter(expense => {
      if (!expense) return false;
      
      // Pour les dépenses récurrentes
      if (expense.type === 'recurrente') {
        if (!expense.startDate) return false;
        
        const startDate = new Date(expense.startDate);
        const endDate = expense.endDate ? new Date(expense.endDate) : null;
        
        const isAfterStart = currentDate >= startDate;
        const isBeforeEnd = endDate ? currentDate <= endDate : true;
        
        return isAfterStart && isBeforeEnd;
      }
      
      // Pour les dépenses ponctuelles
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);

  // Calculer le solde (revenus - dépenses)
  const balance = totalIncome - totalExpenses;

  // Vérifier si le budget est dépassé
  const isBudgetExceeded = totalExpenses > totalIncome;
  const exceededAmount = isBudgetExceeded ? totalExpenses - totalIncome : 0;

  // Grouper les dépenses par catégorie pour le graphique
  const expensesByCategory = safeExpenses
    .filter(expense => {
      if (!expense) return false;
      
      // Pour les dépenses récurrentes
      if (expense.type === 'recurrente') {
        if (!expense.startDate) return false;
        
        const startDate = new Date(expense.startDate);
        const endDate = expense.endDate ? new Date(expense.endDate) : null;
        
        const isAfterStart = currentDate >= startDate;
        const isBeforeEnd = endDate ? currentDate <= endDate : true;
        
        return isAfterStart && isBeforeEnd;
      }
      
      // Pour les dépenses ponctuelles
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentDate.getMonth() && 
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((acc, expense) => {
      if (!expense.category) return acc;
      
      const category = expense.category;
      const amount = parseFloat(expense.amount) || 0;
      
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

  // Préparer les données pour le graphique en camembert
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  }));

  // Couleurs pour chaque catégorie
  const categoryColors = [
    '#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
  ];

  // Trier les dépenses par date (les plus récentes en premier)
  const sortedExpenses = [...safeExpenses].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Tableau de Bord - {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </h2>
      
      {/* Alertes de dépassement de budget */}
      {isBudgetExceeded && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Attention</p>
          <p>Vous avez dépassé votre budget ce mois-ci de {exceededAmount.toFixed(2)} €</p>
        </div>
      )}
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Revenus Totaux</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalIncome.toFixed(2)} €</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Dépenses Totales</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalExpenses.toFixed(2)} €</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Solde</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>
      
      {/* Graphique des dépenses par catégorie */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Répartition des Dépenses par Catégorie</h3>
        
        {chartData.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center">
            {/* Diagramme circulaire */}
            <div className="relative w-64 h-64 mb-6 md:mb-0 md:mr-8">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {chartData.reduce((acc, item, index) => {
                  const startAngle = acc.currentAngle;
                  const angle = (item.percentage / 100) * 360;
                  const endAngle = startAngle + angle;
                  
                  // Conversion des angles en coordonnées pour le chemin SVG
                  const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
                  const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
                  const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
                  const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
                  
                  // Déterminer si l'arc est long (plus de 180 degrés)
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return {
                    elements: [
                      ...acc.elements,
                      <path
                        key={index}
                        d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={categoryColors[index % categoryColors.length]}
                        stroke="white"
                        strokeWidth="1"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ],
                    currentAngle: endAngle
                  };
                }, { elements: [], currentAngle: 0 }).elements}
                
                {/* Centre du camembert */}
                <circle cx="50" cy="50" r="15" fill="white" />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="8" fontWeight="bold">
                  Total
                </text>
                <text x="50" y="50" textAnchor="middle" dy="1.5em" fontSize="6">
                  {totalExpenses.toFixed(2)} €
                </text>
              </svg>
            </div>
            
            {/* Légende */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-2" 
                        style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium dark:text-gray-300">{item.amount.toFixed(2)} €</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune dépense ce mois-ci</p>
        )}
      </div>
      
      {/* Dernières dépenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Dernières Dépenses</h3>
        
        {sortedExpenses.length > 0 ? (
          sortedExpenses.slice(0, 5).map((expense, index) => (
            <div key={expense.id || index} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium dark:text-gray-300">{expense.description || 'Sans description'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {expense.category || 'Non catégorisé'} • {expense.date ? new Date(expense.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  {expense.type === 'recurrente' && ' (Récurrente)'}
                </p>
              </div>
              <span className="text-red-600 dark:text-red-400 font-medium">{(parseFloat(expense.amount) || 0).toFixed(2)} €</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune dépense enregistrée</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;