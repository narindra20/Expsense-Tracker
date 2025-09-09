import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'; 
import { authenticateToken } from "../middleware/middleware.js";



const router = express.Router();
const JWT_SECRET = "Fitiavana";
const prisma = new PrismaClient(); 

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

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.json({ success: true, userId: user.id });
  } catch (err) {
    if (err.code === "P2002") {
      res.json({ success: false, message: "Email déjà utilisé" });
    } else {
      console.error(err);
      res.json({ success: false, message: "Erreur serveur" });
    }
  }
});



//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      success: true,
      user: { id: user.id, firstName: user.firstName, email: user.email },
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
