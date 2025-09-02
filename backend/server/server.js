import express from "express";
import cors from "cors";
import authRoutes from "../routes/login.js";
import pool from "../db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur Expense Tracker !");
});


app.use("/", authRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(` Serveur lancé sur http://localhost:${PORT}`)
);
