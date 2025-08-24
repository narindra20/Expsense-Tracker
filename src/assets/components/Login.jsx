export default function Login() {
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">

      <div className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="text-black text-3xl font-bold">
            <h1>Expense Tracker</h1>
          </div>
        </div>
      </div>

      
      <div className="flex-grow flex flex-col md:flex-col max-w-6xl mx-auto p-4 md:p-8">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 md:pr-10">
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-4 whitespace-nowrap ml-8">
            Expense Tracker
          </h1>
          <p className="md:text-xl text-gray-600 max-w-md mx-auto md:mx-0 whitespace-nowrap ml-40">
            Bienvenue sur notre page pour gérer vos finances.
          </p>
        </div>

        {/**FORMULAIRE*/}
        <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md mt-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">CONNEXION</h2>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Adresse e-mail ou numéro de téléphone"
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-md transition-colors"
            >
              Se connecter
            </button>
          </form>
          
          <div className="text-center mt-4 mb-4">
            <a href="#" className="text-gray-600 text-sm hover:underline">Mot de passe oublié ?</a>
          </div>
          
          
          <div className="text-center mt-4">
            <button className="bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm inline-block transition-colors">
              Créer un nouveau compte
            </button>
          </div>
        </div>
      </div>

    
    </div>
  );
}