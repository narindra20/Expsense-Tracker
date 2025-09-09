import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Gauge,
  Wallet,
  PlusCircle,
  Tag,
  BarChart,
  Moon,
  Sun,
  Lock,
} from "lucide-react";

function Sidebar({ activeSection, setActiveSection, isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: <Gauge /> },
    { id: "expenses", label: "Mes Dépenses", icon: <Wallet /> },
    { id: "add", label: "Ajouter une Dépense", icon: <PlusCircle /> },
    { id: "categories", label: "Catégories", icon: <Tag /> },
    { id: "reports", label: "Rapports", icon: <BarChart /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderMenuItem = (item) => {
    const isActive = activeSection === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => setActiveSection(item.id)}
          className={`flex items-center w-full p-3 rounded-lg transition-colors
            ${isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-100 dark:hover:bg-gray-700"}`}
        >
          <span className="mr-3 text-indigo-500 dark:text-indigo-300">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="w-64 h-full flex flex-col p-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors">
      
      <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        Mon Budget
      </h2>

      <nav className="flex-1">
        <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
      </nav>

      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-between w-full p-3 mt-4 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center">
          {isDarkMode ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
          <span>Mode {isDarkMode ? "sombre" : "clair"}</span>
        </div>
        <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isDarkMode ? "bg-indigo-500" : "bg-gray-400"}`}>
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}></div>
        </div>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center w-full p-3 mt-auto rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <Lock className="w-5 h-5 mr-3" />
        <span>Déconnexion</span>
      </button>

    </div>
  );
}

export default Sidebar;
