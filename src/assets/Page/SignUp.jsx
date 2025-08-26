export default function SignUp() {
    return (
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md mt-10">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Créer un nouveau compte
        </h2>

        <form className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Prénom"
              className="w-1/2 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 "
            />
            <input
              type="text"
              placeholder="Nom de famille"
              className="w-1/2 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 "
            />
          </div>
  
          <input
            type="text"
            placeholder="Numéro de portable ou e-mail"
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 "
          /> 
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 "
          />
  
          <label className="text-sm text-gray-700 font-medium">Anniversaire</label>
          <div className="flex gap-2">
            <select className="w-1/3 px-2 py-2 border border-gray-300 rounded-md">
              <option>Jour</option>
              {[...Array(31)].map((_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
            <select className="w-1/3 px-2 py-2 border border-gray-300 rounded-md">
              <option>Mois</option>
              {[
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
              ].map((mois, i) => (
                <option key={i}>{mois}</option>
              ))}
            </select>
            <select className="w-1/3 px-2 py-2 border border-gray-300 rounded-md">
              <option>Année</option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i}>{2025 - i}</option>
              ))}
            </select>
          </div>
  
          <label className="text-sm text-gray-700 font-medium">Genre</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="genre" value="Femme" />
              Femme
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="genre" value="Homme" />
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="genre" value="Personnalisé" />
              Personnalisé
            </label>
          </div>
  
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-500 text-white font-bold py-3 rounded-md transition-colors mt-4"
          >
            S’inscrire
          </button>
        </form>
  
        <div className="text-center mt-4">
          <a href="#" className="text-gray-600 text-sm hover:underline">
            Vous avez déjà un compte ?
          </a>
        </div>

      </div>
    );
  }
  