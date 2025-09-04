import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data.success) {
        setMessage("Compte créé avec succès !");
        navigate("/");
      } else {
        setMessage(response.data.message || "Erreur lors de la création du compte");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md mt-10 mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Créer un nouveau compte
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSignup}>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-1/2 px-4 py-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-1/2 px-4 py-3 border rounded-md"
            required
          />
        </div>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-gray-500 text-white font-bold py-3 rounded-md"
        >
          S’inscrire
        </button>
      </form>
      {message && <div className="text-center mt-4 text-red-500">{message}</div>}
      <div className="text-center mt-4">
        <Link to="/" className="text-gray-600 text-sm hover:underline">
          Vous avez déjà un compte ?
        </Link>
      </div>
    </div>
  );
}
