import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function Reports({ expenses = [], incomes = [] }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('expenses');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Fonction pour exporter les données au format CSV
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('Aucune donnée à exporter pour la période sélectionnée');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const csvContent = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    ).join('\n');

    const csv = `${headers}\n${csvContent}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  // Fonction pour exporter les données au format JSON
  const exportToJSON = (data, filename) => {
    if (data.length === 0) {
      alert('Aucune donnée à exporter pour la période sélectionnée');
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, `${filename}.json`);
  };

  // Fonction pour exporter les reçus (simulation)
  const exportReceipts = () => {
    // Filtrer les dépenses avec reçus
    const expensesWithReceipts = expenses.filter(expense => expense.receipt);
    
    if (expensesWithReceipts.length === 0) {
      alert('Aucun reçu à exporter');
      return;
    }

    // Dans une application réelle, vous téléchargeriez les fichiers réels
    // Pour cet exemple, nous créons un ZIP simulé avec les informations des reçus
    const receiptsInfo = expensesWithReceipts.map(expense => ({
      id: expense.id,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      receiptFilename: expense.receipt.name || `reçu_${expense.id}.pdf`
    }));

    const receiptsCSV = Object.keys(receiptsInfo[0]).join(',') + '\n' +
      receiptsInfo.map(r => Object.values(r).join(',')).join('\n');
    
    const blob = new Blob([receiptsCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `recus_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    alert(`${expensesWithReceipts.length} reçus ont été préparés pour l'export. Dans une application réelle, les fichiers seraient téléchargés.`);
  };

  // Filtrer les données selon la période sélectionnée
  const filterDataByDateRange = (data) => {
    if (!dateRange.start && !dateRange.end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date('1970-01-01');
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Préparer les données pour l'export
  const prepareExportData = () => {
    let dataToExport = [];
    
    if (exportType === 'expenses') {
      dataToExport = filterDataByDateRange(expenses).map(expense => ({
        Date: expense.date,
        Montant: expense.amount,
        Catégorie: expense.category,
        Description: expense.description || '',
        Type: expense.type || 'ponctuelle',
        Reçu: expense.receipt ? 'Oui' : 'Non'
      }));
    } else if (exportType === 'incomes') {
      dataToExport = filterDataByDateRange(incomes).map(income => ({
        Date: income.date,
        Montant: income.amount,
        Source: income.source,
        Description: income.description || ''
      }));
    } else if (exportType === 'all') {
      const exportExpenses = filterDataByDateRange(expenses).map(expense => ({
        Type: 'Dépense',
        Date: expense.date,
        Montant: -expense.amount, // Montant négatif pour les dépenses
        Catégorie: expense.category,
        Description: expense.description || '',
        Source: ''
      }));
      
      const exportIncomes = filterDataByDateRange(incomes).map(income => ({
        Type: 'Revenu',
        Date: income.date,
        Montant: income.amount,
        Catégorie: '',
        Description: income.description || '',
        Source: income.source
      }));
      
      dataToExport = [...exportExpenses, ...exportIncomes].sort((a, b) => 
        new Date(a.Date) - new Date(b.Date)
      );
    }
    
    return dataToExport;
  };

  // Gérer l'export
  const handleExport = () => {
    const dataToExport = prepareExportData();
    const filename = `export_${exportType}_${new Date().toISOString().split('T')[0]}`;
    
    if (exportFormat === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      exportToJSON(dataToExport, filename);
    }
  };

  // Calcul des dépenses par mois
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7); // Format YYYY-MM
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Rapports et Export de Données
      </h2>
      
      {/* Statistiques des dépenses par mois */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Dépenses par Mois</h3>
        {Object.keys(monthlyExpenses).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(monthlyExpenses)
              .sort(([monthA], [monthB]) => new Date(monthB) - new Date(monthA))
              .map(([month, amount]) => (
              <div key={month}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="font-medium dark:text-gray-300">{amount.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full" 
                    style={{ width: `${(amount / Math.max(...Object.values(monthlyExpenses))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Section d'export des données */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Export des Données</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sélection du type d'export */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Type de données</label>
            <select 
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full shadow border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="expenses">Dépenses seulement</option>
              <option value="incomes">Revenus seulement</option>
              <option value="all">Dépenses et revenus</option>
            </select>
          </div>
          
          {/* Sélection du format */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Format d'export</label>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full shadow border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        
        {/* Sélection de la période */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Date de début</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full shadow border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Date de fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full shadow border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
        >
          Exporter les Données
        </button>
      </div>
      
      {/* Section d'export des reçus */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Export des Reçus</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Exportez tous vos reçus enregistrés dans un format compressé.
        </p>
        <button 
          onClick={exportReceipts}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
        >
          Exporter les Reçus
        </button>
      </div>
    </div>
  );
}

export default Reports;