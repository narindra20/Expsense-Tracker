import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authenticateToken } from "../middleware/middleware.js"

const router = express.Router();
const JWT_SECRET = "Fitiavana";

// SIGNUP
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.json({ success: false, message: "Tous les champs sont requis" });

  try {
    // Vérifie si l'email existe déjà
    const exist = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (exist.rows.length > 0)
      return res.json({ success: false, message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1,$2,$3,$4)",
      [firstName, lastName, email, hashedPassword]
    );

    res.json({ success: true, message: "Compte créé avec succès" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      success: true,
      user: { id: user.id, firstName: user.first_name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erreur serveur" });
  }
});

// ROUTE PROTÉGÉE
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ${req.user.userId}` });
});

export default router;
