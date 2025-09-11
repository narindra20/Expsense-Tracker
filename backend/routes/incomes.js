import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET tous les revenus
router.get("/", authenticateToken, async (req, res) => {
  const { start, end } = req.query;
  try {
    let where = { userId: Number(req.user.userId) };
    if (start && end) where.date = { gte: new Date(start), lte: new Date(end) };

    const incomes = await prisma.income.findMany({ where, orderBy: { date: "desc" } });
    res.json({ success: true, incomes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST nouveau revenu
router.post("/", authenticateToken, async (req, res) => {
  const { title, amount, date, description } = req.body;
  if (!title || !amount || !date) return res.status(400).json({ success: false, message: "Champs manquants" });

  try {
    const newIncome = await prisma.income.create({
      data: {
        title,
        amount: parseFloat(amount),
        date: new Date(date),
        description: description || "",
        userId: Number(req.user.userId),
      },
    });
    res.json({ success: true, income: newIncome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
