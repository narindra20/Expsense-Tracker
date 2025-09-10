// /backend/index.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/login.js";
import categoryRoutes from "./routes/categories.js";
import expenseRoutes from "./routes/expenses.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
