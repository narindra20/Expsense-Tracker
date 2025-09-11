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
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const API_URL = "http://localhost:5000/api";

  // 🌙 Thème : récupérer depuis localStorage dès le premier rendu
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  // Charger catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  // Charger dépenses depuis l'API
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const handleAddExpense = (expenseData) => {
    // Ajouter localement
    setExpenses(prev => [...prev, expenseData]);
    // Recharger toutes les dépenses pour être sûr qu'elles sont bien persistées
    fetchExpenses();
  };

  const handleDeleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));
  const handleUpdateExpense = (updatedExpense) =>
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));

  const handleAddIncome = (incomeData) => setIncomes(prev => [...prev, { id: incomes.length + 1, ...incomeData }]);

  const renderActiveSection = () => {
    switch(activeSection) {
      case "dashboard":
        return <Dashboard expenses={expenses} incomes={incomes} categories={categories} isDarkMode={isDarkMode} />;
      case "expenses":
        return categories.length > 0 ? (
          <ExpensesList 
            expenses={expenses} 
            onDelete={handleDeleteExpense} 
            onUpdate={handleUpdateExpense} 
            categories={categories} 
            isDarkMode={isDarkMode} 
          />
        ) : null;
      case "add":
        return categories.length > 0 ? (
          <AddExpense categories={categories} onAdd={handleAddExpense} isDarkMode={isDarkMode} />
        ) : null;
      case "categories":
        return <Categories categories={categories} setCategories={setCategories} isDarkMode={isDarkMode} />;
      case "addIncome":
        return <AddIncome onAdd={handleAddIncome} isDarkMode={isDarkMode} />;
      case "reports":
        return <Reports expenses={expenses} isDarkMode={isDarkMode} />;
      case "settings":
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return <Dashboard expenses={expenses} incomes={incomes} categories={categories} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Suivi de Dépenses Personnelles</h1>
          <p className={`text-gray-600 ${isDarkMode ? "dark:text-gray-300" : ""}`}>Gérez vos finances facilement</p>
        </header>
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default ExpenseTracker;
