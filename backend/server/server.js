const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); 
    res.json({ message: "Connexion PostgreSQL OK !", time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de se connecter à PostgreSQL" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
