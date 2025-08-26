export default function FormulaireDepense() {
    return (
      <form className="bg-white shadow-md rounded p-6 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">Nouvelle dépense</h2>
        <input type="number" placeholder="Montant" className="w-full border px-4 py-2 rounded" />
        <input type="date" className="w-full border px-4 py-2 rounded" />
        <select className="w-full border px-4 py-2 rounded">
          <option>Catégorie</option>
          <option>Alimentation</option>
          <option>Transport</option>
          <option>Logement</option>
        </select>
        <textarea placeholder="Description (optionnelle)" className="w-full border px-4 py-2 rounded" />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="recurrent" />
          <label htmlFor="recurrent">Dépense récurrente</label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter
        </button>
      </form>
    );
  }
  