import express from "express";
import cors from "cors";
import authRoutes from "./routes/login.js";
import expenseRoutes from "./routes/expenses.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// Routes
app.use("/", authRoutes);
app.use("/", expenseRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});



