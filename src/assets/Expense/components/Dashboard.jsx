import React, { useMemo } from "react";

function Dashboard({ expenses = [], incomes = [], categories = [], currentMonth = new Date() }) {
  // Sécuriser les props
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeIncomes = Array.isArray(incomes) ? incomes : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const currentDate = currentMonth instanceof Date ? currentMonth : new Date();
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const isRecurrentExpenseActiveThisMonth = (expense) => {
    if (!expense.startDate) return false;
    const startDate = new Date(expense.startDate);
    const endDate = expense.endDate ? new Date(expense.endDate) : null;
    return startDate <= currentMonthEnd && (!endDate || endDate >= currentMonthStart);
  };

  // Filtrer les dépenses du mois
  const currentMonthExpenses = useMemo(() => {
    return safeExpenses.filter(expense => {
      if (!expense) return false;
      const isRecurrent = expense.type?.toLowerCase() === "recurrente";
      if (isRecurrent) return isRecurrentExpenseActiveThisMonth(expense);
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [safeExpenses, currentDate]);

  // Calculs
  const totalIncome = useMemo(() => {
    return safeIncomes
      .filter(income => income?.date && new Date(income.date).getMonth() === currentDate.getMonth() && new Date(income.date).getFullYear() === currentDate.getFullYear())
      .reduce((total, income) => total + (parseFloat(income.amount) || 0), 0);
  }, [safeIncomes, currentDate]);

  const totalExpenses = currentMonthExpenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);
  const balance = totalIncome - totalExpenses;
  const isBudgetExceeded = totalExpenses > totalIncome;
  const exceededAmount = isBudgetExceeded ? totalExpenses - totalIncome : 0;

  // Répartition par catégorie
  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    if (!expense.category) return acc;
    const categoryName = typeof expense.category === "object" ? expense.category.name : expense.category;
    acc[categoryName] = (acc[categoryName] || 0) + (parseFloat(expense.amount) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
  }));

  const categoryColors = [
    "#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#06b6d4", "#f97316", "#84cc16", "#6366f1",
  ];

  const sortedExpenses = [...safeExpenses].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Tableau de Bord -{" "}
        {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
      </h2>

      {isBudgetExceeded && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Attention</p>
          <p>Vous avez dépassé votre budget de {exceededAmount.toFixed(2)} €</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Revenus</h3>
          <p className="text-3xl font-bold text-green-600">{totalIncome.toFixed(2)} €</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Dépenses</h3>
          <p className="text-3xl font-bold text-red-600">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Solde</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Graphique dépenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Répartition des Dépenses
        </h3>
        {chartData.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative w-64 h-64 mb-6 md:mb-0 md:mr-8">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {chartData.reduce((acc, item, index) => {
                  const startAngle = acc.currentAngle;
                  const angle = (item.percentage / 100) * 360;
                  const endAngle = startAngle + angle;

                  const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
                  const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
                  const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
                  const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);

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
                      />,
                    ],
                    currentAngle: endAngle,
                  };
                }, { elements: [], currentAngle: 0 }).elements}
                <circle cx="50" cy="50" r="15" fill="white" />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="8" fontWeight="bold">
                  Total
                </text>
                <text x="50" y="50" textAnchor="middle" dy="1.5em" fontSize="6">
                  {totalExpenses.toFixed(2)} €
                </text>
              </svg>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                    />
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.amount.toFixed(2)} €</div>
                    <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Aucune dépense ce mois-ci</p>
        )}
      </div>

      {/* Dernières dépenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Dernières Dépenses</h3>
        {sortedExpenses.length > 0 ? (
          sortedExpenses.slice(0, 5).map((expense, index) => (
            <div key={expense.id || index} className="flex justify-between py-3 border-b">
              <div>
                <p className="font-medium">{expense.description || "Sans description"}</p>
                <p className="text-sm text-gray-500">
                  {(typeof expense.category === "object" ? expense.category.name : expense.category) || "Non catégorisé"} •{" "}
                  {expense.date ? new Date(expense.date).toLocaleDateString("fr-FR") : "Date inconnue"}
                  {expense.type?.toLowerCase() === "recurrente" && " (Récurrente)"}
                </p>
              </div>
              <span className="text-red-600 font-medium">
                {(parseFloat(expense.amount) || 0).toFixed(2)} €
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune dépense enregistrée</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
