import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // efface le message quand l'utilisateur change quelque chose
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", form);

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

  const inputClass = "w-full px-4 py-3 border rounded-md";

  return (
    <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md mt-10 mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Créer un nouveau compte
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSignup}>
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 border rounded-md"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 border rounded-md"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />

        <button type="submit" className="bg-gray-500 text-white font-bold py-3 rounded-md">
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
