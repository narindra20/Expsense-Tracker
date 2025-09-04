import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Accès refusé"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <h1 className="text-3xl font-bold">{message}</h1>
    </div>
  );
}
