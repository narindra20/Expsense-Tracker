import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ExpensesList from "./components/ExpensesList";
import AddExpense from "./components/AddExpense";
import Categories from "./components/Categories";
import Reports from "./components/Reports";

function ExpenseTracker() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    "Alimentation", "Transport", "Logement", "Loisirs", "Santé", "Autres",
  ]);

  // Mode sombre / clair
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Données factices
  useEffect(() => {
    setExpenses([
      { id: 1, title: "Courses", amount: 85.5, category: "Alimentation", date: "2023-10-15", type: "Ponctuelle" },
      { id: 2, title: "Loyer", amount: 650, category: "Logement", date: "2023-10-05", type: "Récurrente" },
    ]);
  }, []);

  const handleAddExpense = (expenseData) => {
    setExpenses([
      ...expenses,
      { id: expenses.length + 1, ...expenseData, amount: parseFloat(expenseData.amount) },
    ]);
  };

  const handleDeleteExpense = (id) =>
    setExpenses(expenses.filter((e) => e.id !== id));

  const totalExpenses = expenses.reduce((total, e) => total + e.amount, 0);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard expenses={expenses} totalExpenses={totalExpenses} />;
      case "expenses":
        return <ExpensesList expenses={expenses} onDelete={handleDeleteExpense} categories={categories} />;
      case "add":
        return <AddExpense categories={categories} onAdd={handleAddExpense} />;
      case "categories":
        return <Categories categories={categories} setCategories={setCategories} />;
      case "reports":
        return <Reports expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} totalExpenses={totalExpenses} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Suivi de Dépenses Personnelles
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos finances facilement
          </p>
        </header>

        {renderActiveSection()}
      </div>
    </div>
  );
}

export default ExpenseTracker;
