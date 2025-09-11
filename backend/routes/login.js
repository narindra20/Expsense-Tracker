import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "Fitiavana";

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.json({ success: false, message: "Tous les champs sont requis" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
    res.json({ success: true, userId: user.id });
  } catch (err) {
    if (err.code === "P2002") // Conflit Prisma : email unique
      res.json({ success: false, message: "Email déjà utilisé" });
    else {
      console.error(err);
      res.json({ success: false, message: "Erreur serveur" });
    }
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.json({ success: false, message: "Email ou mot de passe incorrect" });

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

// ===== DASHBOARD (protégé) =====
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ${req.user.userId}` });
});

// ===== CHANGE PASSWORD =====
router.patch("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Champs manquants" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Mot de passe changé avec succès" });
  } catch (err) {
    console.error("Erreur serveur change-password :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ======================= INFO UTILISATEUR CONNECTÉ =======================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.userId) },
      select: { email: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


export default router;
