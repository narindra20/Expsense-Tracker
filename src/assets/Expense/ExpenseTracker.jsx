/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ExpensesList from "./components/ExpensesList";
import AddExpense from "./components/AddExpense";
import Categories from "./components/Categories";
import IncomesList from "./components/IncomesList";
import AddIncome from "./components/AddIncome";
import Settings from "./components/Settings";

function ExpenseTracker() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  
  const userId = 1;
  const API_URL = "http://localhost:5000/api";

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

  // Charger revenus depuis l'API
  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/incomes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleAddExpense = (expenseData) => {
    setExpenses(prev => [...prev, expenseData]);
    fetchExpenses();
  };

  const handleDeleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));
  
  const handleUpdateExpense = (updatedExpense) =>
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));

  const handleAddIncome = (newIncome) => {
    setIncomes(prev => [newIncome, ...prev]);
  };

  const handleDeleteIncome = (id) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const handleUpdateIncome = (updatedIncome) => {
    setIncomes(prev =>
      prev.map(income => income.id === updatedIncome.id ? updatedIncome : income)
    );
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Filtrer les dépenses pour l'affichage
  const ponctualExpenses = expenses.filter(e => e.type?.toLowerCase() === "ponctuelle");
  const recurrentExpenses = expenses.filter(e => e.type?.toLowerCase() === "recurrente");

  const totalExpenses = expenses.reduce((t, e) => t + (e.amount || 0), 0);
  const totalPonctualExpenses = ponctualExpenses.reduce((t, e) => t + (e.amount || 0), 0);

  const renderActiveSection = () => {
    switch(activeSection) {
      case "dashboard": 
        return <Dashboard 
                  expenses={ponctualExpenses}
                  incomes={incomes}
                  totalExpenses={totalExpenses}
                  isDarkMode={isDarkMode} 
               />;
      case "expenses": 
        return (
          <ExpensesList 
            expenses={expenses}
            onDelete={handleDeleteExpense} 
            onUpdate={handleUpdateExpense} 
            categories={categories} 
            isDarkMode={isDarkMode} 
          />
        );
      case "add":
        return categories.length > 0 ? (
          <AddExpense categories={categories} onAdd={handleAddExpense} isDarkMode={isDarkMode} />
        ) : null;
      case "categories":
        return <Categories categories={categories} setCategories={setCategories} isDarkMode={isDarkMode} />;
      case "incomes": 
        return (
          <IncomesList 
            incomes={incomes}
            onDelete={handleDeleteIncome}
            onUpdate={handleUpdateIncome}
            isDarkMode={isDarkMode} 
          />
        );
      case "addIncome": 
        return <AddIncome onAdd={handleAddIncome} isDarkMode={isDarkMode} />;
      case "settings":
        return <Settings isDarkMode={isDarkMode} />;
      default: 
        return <Dashboard 
                  expenses={ponctualExpenses}
                  incomes={incomes}
                  totalExpenses={totalPonctualExpenses}
                  isDarkMode={isDarkMode} 
               />;
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Suivi de Dépenses Personnelles
          </h1>
          <p className={`text-gray-600 ${isDarkMode ? "dark:text-gray-300" : ""}`}>
            Gérez vos finances facilement
          </p>
        </header>
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default ExpenseTracker;