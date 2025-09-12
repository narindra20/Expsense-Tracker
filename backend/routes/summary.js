import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Résumé du mois 

router.get("/monthly", authenticateToken, async (req, res) => {
  const { month } = req.query; 
  const date = month ? new Date(`${month}-01`) : new Date();

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(req.user.userId), date: { gte: start, lte: end } },
    });

    const incomes = await prisma.income.findMany({
      where: { userId: Number(req.user.userId), date: { gte: start, lte: end } },
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);

    res.json({ totalExpenses, totalIncome, balance: totalIncome - totalExpenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Résumé sur une période spécifique

router.get("/", authenticateToken, async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) return res.status(400).json({ message: "start et end requis" });

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(req.user.userId), date: { gte: new Date(start), lte: new Date(end) } },
    });

    const incomes = await prisma.income.findMany({
      where: { userId: Number(req.user.userId), date: { gte: new Date(start), lte: new Date(end) } },
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);

    res.json({ totalExpenses, totalIncome, balance: totalIncome - totalExpenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Alertes : dépenses > revenus 
router.get("/alerts", authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({ where: { userId: Number(req.user.userId) } });
    const incomes = await prisma.income.findMany({ where: { userId: Number(req.user.userId) } });

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);

    if (totalExpenses > totalIncome) {
      return res.json({
        alert: true,
        message: `Vous avez dépassé votre budget de ${(totalExpenses - totalIncome).toFixed(2)} €`,
      });
    }

    res.json({ alert: false, message: "Budget respecté" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
