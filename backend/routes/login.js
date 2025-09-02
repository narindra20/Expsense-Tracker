import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import pool from "../db.js"; 
import backendRouter from "./backend.js";

const app = express();
app.use("/auth", backendRouter); 
app.listen(5000, () => console.log("Serveur démarré sur le port 5000"));
import pool from "../db.js"; 

const router = express.Router();

const JWT_SECRET = "Fitiavana"; 


router.use(express.json());

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.json({ success: false, message: "Tous les champs sont requis" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    await pool.query(query, [firstName, lastName, email, hashedPassword]);
    res.json({ success: true });
  } catch (err) {
    if (err.code === "23505") {
      res.json({ success: false, message: "Email déjà utilisé" });
    } else {
      console.error(err);
      res.json({ success: false, message: "Erreur serveur" });
    }
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    // Génération du JWT
    const token = jwt.sign(
      { userId: user.id }, // Payload avec l'ID utilisateur
      JWT_SECRET, // Clé secrète
      { expiresIn: "1h" } // Expiration du token (1 heure)
    );

    res.json({
      success: true,
      user: { id: user.id, firstName: user.first_name, email: user.email },
      token // Envoi du token dans la réponse
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erreur serveur" });
  }
});



export default router;