import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

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
    if (err.code === "P2002")
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

// ===== DASHBOARD =====
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ${req.user.userId}` });
});

// ===== CHANGE PASSWORD =====
router.patch("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    console.log("Champs manquants :", req.body);
    return res.status(400).json({ success: false, message: "Champs manquants" });
  }

  try {
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      console.log("Utilisateur non trouvé pour l'ID :", req.user.userId);
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    console.log("Utilisateur trouvé :", user.email);

    // Comparer l'ancien mot de passe
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      console.log("Mot de passe actuel incorrect pour l'utilisateur :", user.email);
      return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Nouveau hash :", hashedPassword);

    // Mettre à jour le mot de passe dans la base
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log("Mot de passe mis à jour pour l'utilisateur :", updatedUser.email);

    res.json({ success: true, message: "Mot de passe changé avec succès" });
  } catch (err) {
    console.error("Erreur serveur change-password :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
