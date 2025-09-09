import express from "express";
import cors from "cors";
import authRoutes from "./routes/login.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
