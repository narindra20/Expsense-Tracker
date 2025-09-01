import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // routes d’authentification

const app = express();

app.use(cors());
app.use(express.json());


app.use("/", authRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`)
);
