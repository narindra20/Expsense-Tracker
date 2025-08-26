export default function ListeDepenses() {
    const faussesDepenses = [
      { id: 1, montant: 5000, date: "2025-08-01", catégorie: "Alimentation" },
      { id: 2, montant: 12000, date: "2025-08-03", catégorie: "Transport" },
    ];
  
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Mes dépenses</h2>
        <ul className="space-y-3">
          {faussesDepenses.map((depense) => (
            <li key={depense.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{depense.catégorie}</p>
                <p className="text-sm text-gray-600">{depense.date}</p>
              </div>
              <p className="text-red-600 font-bold">{depense.montant} Ar</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  