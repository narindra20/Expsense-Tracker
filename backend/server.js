import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/login.js";
import expenseRoutes from "./routes/expenses.js";
import incomeRoutes from "./routes/incomes.js";
import categoryRoutes from "./routes/categories.js";


dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // pour servir les fichiers reçus


// Routes
app.use("/", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/categories", categoryRoutes);


// Routes API (toutes sous /api)
app.use("/api/auth", authRoutes);        // /api/auth/login, /api/auth/signup, etc.
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);


// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Middleware gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur serveur globale :", err);
  res.status(500).json({ message: "Erreur serveur interne" });
});

// Routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});