import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpensesList from './components/ExpensesList';
import AddExpense from './components/AddExpense';
import Categories from './components/Categories';
import Reports from './components/Reports';

function ExpenseTracker() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    'Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres'
  ]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Vérifier la préférence sauvegardée ou utiliser le mode clair par défaut
    return localStorage.getItem('darkMode') === 'true';
  });

  // Appliquer le mode sombre au document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Sauvegarder la préférence
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Données factices pour la démonstration
  useEffect(() => {
    const sampleExpenses = [
      { id: 1, title: 'Courses', amount: 85.50, category: 'Alimentation', date: '2023-10-15', type: 'Ponctuelle' },
      { id: 2, title: 'Loyer', amount: 650.00, category: 'Logement', date: '2023-10-05', type: 'Récurrente' },
      { id: 3, title: 'Essence', amount: 45.00, category: 'Transport', date: '2023-10-12', type: 'Ponctuelle' },
      { id: 4, title: 'Cinéma', amount: 25.00, category: 'Loisirs', date: '2023-10-10', type: 'Ponctuelle' },
    ];
    setExpenses(sampleExpenses);
  }, []);

  // Fonction pour ajouter une dépense
  const handleAddExpense = (expenseData) => {
    const expense = {
      id: expenses.length + 1,
      ...expenseData,
      amount: parseFloat(expenseData.amount)
    };
    
    setExpenses([...expenses, expense]);
  };

  // Fonction pour supprimer une dépense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calcul du total des dépenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Rendu de la section active
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard expenses={expenses} totalExpenses={totalExpenses} />;
      case 'expenses':
        return <ExpensesList 
                 expenses={expenses} 
                 onDelete={handleDeleteExpense} 
                 categories={categories} 
               />;
      case 'add':
        return <AddExpense 
                 categories={categories} 
                 onAdd={handleAddExpense} 
               />;
      case 'categories':
        return <Categories categories={categories} setCategories={setCategories} />;
      case 'reports':
        return <Reports expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} totalExpenses={totalExpenses} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar avec gestion de la déconnexion et mode sombre */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Suivi de Dépenses Personnelles</h1>
          <p className="text-gray-600 dark:text-gray-300">Gérez vos finances facilement</p>
        </header>
        
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default ExpenseTracker;