import React, { useState, useEffect } from "react";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    email: "utilisateur@example.com",
    createdAt: "24 août 2025"
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // Récupérer les données utilisateur depuis l'API
    fetchUserData();
    
    // Vérifier le thème actuel
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const fetchUserData = async () => {
    try {
    
      const token = localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleChangePassword = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setMessage({ text: "Les nouveaux mots de passe ne correspondent pas !", type: "error" });
    return;
  }

  if (newPassword.length < 6) {
    setMessage({ text: "Le mot de passe doit contenir au moins 6 caractères.", type: "error" });
    return;
  }

  try {
    const token = localStorage.getItem("token"); // récupère le token JWT
    if (!token) {
      setMessage({ text: "Vous devez être connecté.", type: "error" });
      return;
    }

    const res = await fetch("http://localhost:5000/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Auth obligatoire
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setMessage({ text: "Mot de passe changé avec succès ✅", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({ text: data.message || "Erreur lors du changement de mot de passe", type: "error" });
    }
  } catch (error) {
    console.error(error);
    setMessage({ text: "Erreur serveur, réessayez plus tard.", type: "error" });
  }
};


  const handleDarkModeToggle = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem('darkMode', newDarkModeState);
    
    // Appliquer le thème au document
    if (newDarkModeState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil et Paramètres</h1>
      
      {/* Section Informations du compte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Informations du compte</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
              {userData.email}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Membre depuis</label>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
              {userData.createdAt}
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Changer le mot de passe */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Changer le mot de passe</h2>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
          >
            Changer le mot de passe
          </button>
        </form>
      </div>
      
      {/* Section Actions de compte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Actions de compte</h2>
        
        <div className="space-y-3">
          <button className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
            Exporter mes données
          </button>
          
          <button className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}