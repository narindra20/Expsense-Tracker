import React, { useState } from 'react';

function AddExpense({ categories, onAdd }) {
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0],
    type: 'Ponctuelle'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    
    onAdd(newExpense);
    
    // Réinitialiser le formulaire
    setNewExpense({
      title: '',
      amount: '',
      category: categories[0],
      date: new Date().toISOString().split('T')[0],
      type: 'Ponctuelle'
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Ajouter une Dépense</h2>
      
      <div className="bg-white p-6 rounded-lg shadow max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Titre de la dépense
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={newExpense.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ex: Courses, Loyer..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Montant (€)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={newExpense.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={newExpense.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={newExpense.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type de dépense
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Ponctuelle"
                  checked={newExpense.type === 'Ponctuelle'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Ponctuelle</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Récurrente"
                  checked={newExpense.type === 'Récurrente'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Récurrente</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Ajouter la Dépense
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;