import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeSection, setActiveSection, isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'expenses', label: 'Mes Dépenses', icon: '💰' },
    { id: 'add', label: 'Ajouter une Dépense', icon: '➕' },
    { id: 'categories', label: 'Catégories', icon: '🏷️' },
    { id: 'reports', label: 'Rapports', icon: '📈' },
    { id: 'parameters', label: 'Paramètres', icon: '📈' },
  ];

  const handleLogout = () => {
    // Supprimer le token d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger vers la page de login
    navigate('/');
  };

  return (
    <div className="w-64  bg-gray-600 text-white p-4 flex flex-col h-full">
      <div className="p-4 mb-6">
        <h2 className="text-xl font-bold">Mon Budget</h2>
      </div>
      
      <nav className="flex-1">
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === item.id ? ' bg-gray-400 text-white' : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bouton de basculement mode sombre/clair */}
      <div className="mb-4">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-700"
        >
          <div className="flex items-center">
            <span className="mr-3 text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
            <span>Mode {isDarkMode ? 'sombre' : 'clair'}</span>
          </div>
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </button>
      </div>
      
      {/* Bouton de déconnexion */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700 text-red-200 hover:text-red-100"
        >
          <span className="mr-3 text-xl">🔒</span>
          <span>Déconnexion</span>
        </button>
      </div>
      
      
    </div>
  );
}

export default Sidebar;