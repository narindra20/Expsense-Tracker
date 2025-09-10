import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ExpensesList from "./components/ExpensesList";
import AddExpense from "./components/AddExpense";
import Categories from "./components/Categories";
import Reports from "./components/Reports";
import AddIncome from "./components/AddIncome";
import Settings from "./components/Settings";

function ExpenseTracker() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]); // 🔑 centralisé
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [incomes, setIncomes] = useState([]);

  const userId = 1; // ⚠️ À remplacer par le userId réel (token)
  const API_URL = "http://localhost:5000/api/categories";

  // Charger les catégories du backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur chargement catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur fetch categories:", err);
    }
  };

  // Ajouter une dépense
  const handleAddExpense = (expenseData) => {
    setExpenses([
      ...expenses,
      { ...expenseData, amount: parseFloat(expenseData.amount) },
    ]);
  };

  // Supprimer une dépense
  const handleDeleteExpense = (id) =>
    setExpenses(expenses.filter((e) => e.id !== id));

  // Ajouter un revenu
  const handleAddIncome = (incomeData) => {
    setIncomes([...incomes, { id: incomes.length + 1, ...incomeData }]);
  };

  // Dark mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Calcul total des dépenses
  const totalExpenses = expenses.reduce((total, e) => total + e.amount, 0);

  // Section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            expenses={expenses}
            totalExpenses={totalExpenses}
            isDarkMode={isDarkMode}
          />
        );
      case "expenses":
        return (
          <ExpensesList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            isDarkMode={isDarkMode}
          />
        );
      case "add":
        return (
          <AddExpense
            categories={categories}
            onAdd={handleAddExpense}
            isDarkMode={isDarkMode}
          />
        );
      case "categories":
        return (
          <Categories
            categories={categories}
            setCategories={setCategories}
            refreshCategories={fetchCategories} // 🔑
            isDarkMode={isDarkMode}
          />
        );
      case "addIncome":
        return <AddIncome onAdd={handleAddIncome} isDarkMode={isDarkMode} />;
      case "reports":
        return <Reports expenses={expenses} isDarkMode={isDarkMode} />;
      case "settings":
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return (
          <Dashboard
            expenses={expenses}
            totalExpenses={totalExpenses}
            isDarkMode={isDarkMode}
          />
        );
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Suivi de Dépenses Personnelles
          </h1>
          <p
            className={`text-gray-600 ${
              isDarkMode ? "dark:text-gray-300" : ""
            }`}
          >
            Gérez vos finances facilement
          </p>
        </header>
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default ExpenseTracker;
