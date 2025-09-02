import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js"; 

const router = express.Router();

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

    res.json({
      success: true,
      user: { id: user.id, firstName: user.first_name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
