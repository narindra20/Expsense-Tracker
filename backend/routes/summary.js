import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 📊 Résumé du mois courant (ou mois spécifique ?month=YYYY-MM)
router.get("/monthly", authenticateToken, async (req, res) => {
  const month = req.query.month || new Date().toISOString().substring(0, 7); // ex: "2025-09"
  const [year, monthNum] = month.split("-");

  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: { userId: Number(req.user.userId), date: { gte: start, lte: end } }
  });

  const incomes = await prisma.income.findMany({
    where: { userId: Number(req.user.userId), date: { gte: start, lte: end } }
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  res.json({
    month,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  });
});

// 📊 Résumé sur une période donnée ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/", authenticateToken, async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ message: "start et end requis" });

  const startDate = new Date(start);
  const endDate = new Date(end);

  const expenses = await prisma.expense.findMany({
    where: { userId: Number(req.user.userId), date: { gte: startDate, lte: endDate } }
  });

  const incomes = await prisma.income.findMany({
    where: { userId: Number(req.user.userId), date: { gte: startDate, lte: endDate } }
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  res.json({
    period: { start, end },
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  });
});

// 🚨 Vérifie si dépenses > revenus sur le mois courant
router.get("/alerts", authenticateToken, async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: { userId: Number(req.user.userId), date: { gte: start, lte: end } }
  });

  const incomes = await prisma.income.findMany({
    where: { userId: Number(req.user.userId), date: { gte: start, lte: end } }
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  if (totalExpenses > totalIncome) {
    res.json({
      alert: true,
      message: `🚨 Vous avez dépassé votre budget mensuel de ${(totalExpenses - totalIncome).toFixed(2)} €`
    });
  } else {
    res.json({
      alert: false,
      message: "✅ Votre budget est équilibré"
    });
  }
});

export default router;
