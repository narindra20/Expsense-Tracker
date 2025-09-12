import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // efface le message à chaque changement
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", form);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setMessage(`Bienvenue ${response.data.user.firstName}`);
        navigate("/dashboard");
      } else {
        setMessage("Identifiants incorrects");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur");
    }
  };

  const inputClass = "px-4 py-3 rounded-md border border-gray-300 w-full";

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-black text-3xl font-bold">Expense Tracker</h1>
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">CONNEXION</h2>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Adresse e-mail"
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
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-md"
            >
              Se connecter
            </button>
          </form>

          {message && (
            <div className="text-center mt-4 text-red-500 font-semibold">{message}</div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md"
            >
              Créer un nouveau compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
