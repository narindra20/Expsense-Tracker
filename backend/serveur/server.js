const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));
