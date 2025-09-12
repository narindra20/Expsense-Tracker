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
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const API_URL = "http://localhost:5000/api";

  // Charger catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data?.categories || data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      setCategories([]);
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
      setExpenses(Array.isArray(data) ? data : data?.expenses || []);
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses:", error);
      setExpenses([]);
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
      setIncomes(data?.incomes || []);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus:", error);
      setIncomes([]);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Debug : voir l'état des données
  useEffect(() => {
    console.log("Incomes:", incomes);
    console.log("Expenses:", expenses);
  }, [incomes, expenses]);

  // Filtrer les dépenses
  const ponctualExpenses = expenses.filter(
    (e) => e?.type?.toLowerCase() === "ponctuelle"
  );
  const recurrentExpenses = expenses.filter(
    (e) => e?.type?.toLowerCase() === "recurrente"
  );

  const totalExpenses = expenses.reduce((t, e) => t + (e?.amount || 0), 0);
  const totalPonctualExpenses = ponctualExpenses.reduce(
    (t, e) => t + (e?.amount || 0),
    0
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            expenses={ponctualExpenses}
            incomes={incomes}
            totalExpenses={totalExpenses}
            isDarkMode={isDarkMode}
          />
        );
      case "expenses":
        return (
          <ExpensesList
            expenses={expenses}
            onDelete={(id) =>
              setExpenses((prev) => prev.filter((e) => e?.id !== id))
            }
            onUpdate={(updatedExpense) =>
              updatedExpense?.id
                ? setExpenses((prev) =>
                    prev.map((e) =>
                      e?.id === updatedExpense.id ? updatedExpense : e
                    )
                  )
                : console.warn("Mise à jour ignorée, dépense invalide:", updatedExpense)
            }
            categories={categories}
            isDarkMode={isDarkMode}
          />
        );
      case "add":
        return categories.length > 0 ? (
          <AddExpense
            categories={categories}
            onAdd={(expenseData) => {
              if (!expenseData || !expenseData.id) {
                console.warn("Ajout ignoré, dépense invalide:", expenseData);
                return;
              }
              setExpenses((prev) => [...prev, expenseData]);
            }}
            isDarkMode={isDarkMode}
          />
        ) : null;
      case "categories":
        return (
          <Categories
            categories={categories}
            setCategories={setCategories}
            isDarkMode={isDarkMode}
          />
        );
      case "incomes":
        return (
          <IncomesList
            incomes={incomes}
            onDelete={(id) =>
              setIncomes((prev) => prev.filter((i) => i?.id !== id))
            }
            onUpdate={(updatedIncome) =>
              updatedIncome?.id
                ? setIncomes((prev) =>
                    prev.map((i) =>
                      i?.id === updatedIncome.id ? updatedIncome : i
                    )
                  )
                : console.warn("Mise à jour ignorée, revenu invalide:", updatedIncome)
            }
            isDarkMode={isDarkMode}
          />
        );
      case "addIncome":
        return (
          <AddIncome
            onAdd={(newIncome) => {
              if (!newIncome || !newIncome.id) {
                console.warn("Ajout ignoré, revenu invalide:", newIncome);
                return;
              }
              setIncomes((prev) => [newIncome, ...prev]);
            }}
            isDarkMode={isDarkMode}
          />
        );
      case "settings":
        return <Settings isDarkMode={isDarkMode} />;
      default:
        return (
          <Dashboard
            expenses={ponctualExpenses}
            incomes={incomes}
            totalExpenses={totalPonctualExpenses}
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
        toggleDarkMode={() => setIsDarkMode((prev) => !prev)}
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
