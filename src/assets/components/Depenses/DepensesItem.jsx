export default function DepenseItem({ catégorie, montant, date, description }) {
    return (
      <div className="bg-white shadow p-4 rounded flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{catégorie}</p>
          <p className="text-sm text-gray-500">{date}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1 italic">{description}</p>
          )}
        </div>
        <p className="text-red-600 font-bold text-lg">{montant} Ar</p>
      </div>
    );
  }
  