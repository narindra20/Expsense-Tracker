import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

function Dashboard({ expenses = [], incomes = [], categories = [], isDarkMode }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeIncomes = Array.isArray(incomes) ? incomes : [];

  const currentDate = new Date();
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

  // 🔹 Dépenses par mois (pour l’histogramme)
  const expensesByMonth = useMemo(() => {
    return safeExpenses.reduce((acc, expense) => {
      if (!expense.date) return acc;
      const month = expense.date.substring(0, 7); // ex: "2025-09"
      acc[month] = (acc[month] || 0) + (parseFloat(expense.amount) || 0);
      return acc;
    }, {});
  }, [safeExpenses]);

  const histogramData = Object.entries(expensesByMonth)
    .map(([month, total]) => ({
      month: new Date(month).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
      total,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // 🔹 Dépenses du mois courant
  const currentMonthExpenses = safeExpenses.filter(e => {
    if (!e.date) return false;
    const date = new Date(e.date);
    return date >= currentMonthStart && date <= currentMonthEnd;
  });

  const totalExpenses = currentMonthExpenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0), 0
  );

  const totalIncome = safeIncomes.filter(i => {
    if (!i.date) return false;
    const date = new Date(i.date);
    return date >= currentMonthStart && date <= currentMonthEnd;
  }).reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  const balance = totalIncome - totalExpenses;
  const isBudgetExceeded = totalExpenses > totalIncome;

  // 🔹 Répartition par catégorie (pour le camembert)
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

  // 🔹 Dernières dépenses
  const sortedExpenses = [...safeExpenses].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });

  // 🔹 Styles
  const cardClass = isDarkMode 
    ? "bg-gray-800 text-white rounded-lg shadow" 
    : "bg-white text-gray-900 rounded-lg shadow";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-semibold mb-6 ${textClass}`}>
        Tableau de Bord -{" "}
        {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
      </h2>

      {/* 🔸 Alerte budget */}
      {isBudgetExceeded && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Attention</p>
          <p>Vous avez dépassé votre budget de {(totalExpenses - totalIncome).toFixed(2)} €</p>
        </div>
      )}

      {/* 🔸 Cartes résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={cardClass + " p-6"}>
          <h3>Revenus</h3>
          <p className="text-3xl font-bold text-green-600">{totalIncome.toFixed(2)} €</p>
        </div>
        <div className={cardClass + " p-6"}>
          <h3>Dépenses</h3>
          <p className="text-3xl font-bold text-red-600">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className={cardClass + " p-6"}>
          <h3>Solde</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* 🔸 Histogramme */}
      <div className={cardClass + " p-6 mb-8"}>
        <h3 className={`text-xl font-semibold mb-4 ${textClass}`}>
          Évolution Mensuelle des Dépenses
        </h3>
        {histogramData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Aucune donnée disponible</p>
        )}
      </div>

      {/* 🔸 Diagramme circulaire */}
      <div className={cardClass + " p-6 mb-8"}>
        <h3 className={`text-xl font-semibold mb-4 ${textClass}`}>Répartition des Dépenses</h3>
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

      {/* 🔸 Dernières dépenses */}
      <div className={cardClass + " p-6"}>
        <h3 className={`text-xl font-semibold mb-4 ${textClass}`}>Dernières Dépenses</h3>
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
