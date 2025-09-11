import express from "express";
import cors from "cors";
import authRoutes from "./routes/login.js";
import categoryRoutes from "./routes/categories.js";
import expenseRoutes from "./routes/expenses.js";
import incomeRoutes from "./routes/incomes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Gestion des routes non trouvées - CORRECTION ICI
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});