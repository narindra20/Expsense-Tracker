import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Lister tous les revenus avec filtres optionnels start/end
router.get("/", authenticateToken, async (req, res) => {
  const { start, end } = req.query;

  try {
    let where = { userId: req.user.userId };
    if (start && end) {
      where.date = { gte: new Date(start), lte: new Date(end) };
    }

    const incomes = await prisma.income.findMany({ where, orderBy: { date: "desc" } });
    res.json({ success: true, incomes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ✅ Voir un revenu par ID
router.get("/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const income = await prisma.income.findUnique({ where: { id } });
    if (!income) return res.status(404).json({ success: false, message: "Revenu non trouvé" });
    res.json({ success: true, income });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ✅ Ajouter un revenu
router.post("/", authenticateToken, async (req, res) => {
  const { title, amount, date, description } = req.body;
  if (!title || !amount || !date || !description) {
    return res.status(400).json({ success: false, message: "Champs manquants" });
  }

  try {
    const newIncome = await prisma.income.create({
      data: {
        title,
        amount: parseFloat(amount),
        date: new Date(date),
        description: description || "",
        userId: req.user.userId,
      },
    });
    res.json({ success: true, income: newIncome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ✅ Modifier un revenu
router.put("/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, amount, date, description } = req.body;

  try {
    const updatedIncome = await prisma.income.update({
      where: { id },
      data: {
        title,
        amount: parseFloat(amount),
        date: new Date(date),
        description: description || "",
      },
    });
    res.json({ success: true, income: updatedIncome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ✅ Supprimer un revenu
router.delete("/:id", authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.income.delete({ where: { id } });
    res.json({ success: true, message: "Revenu supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
