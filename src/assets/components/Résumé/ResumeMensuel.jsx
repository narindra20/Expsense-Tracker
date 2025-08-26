export default function RésuméMensuel() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Résumé du mois</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Revenu total</h2>
            <p className="text-green-600 text-xl font-bold">0 Ar</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Dépenses totales</h2>
            <p className="text-red-600 text-xl font-bold">0 Ar</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Solde restant</h2>
            <p className="text-gray-800 text-xl font-bold">0 Ar</p>
          </div>
        </div>
      </div>
    );
  }
  