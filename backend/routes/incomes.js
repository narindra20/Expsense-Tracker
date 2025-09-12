import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET tous les revenus 
router.get("/", authenticateToken, async (req, res) => {
  const { start, end } = req.query;

  try {
    let filter = { userId: Number(req.user.userId) };

    // Filtrer par dates si fournies
    if (start && end) {
      filter.date = { gte: new Date(start), lte: new Date(end) };
    }

    const incomes = await prisma.income.findMany({
      where: filter,
      orderBy: { date: "desc" },
    });

    res.json({ success: true, incomes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST nouveau revenu
router.post("/", authenticateToken, async (req, res) => {
  const { title, amount, date, description } = req.body;

  if (!title || !amount || !date) {
    return res.status(400).json({ success: false, message: "Champs manquants" });
  }

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

//PUT modifier un revenu 
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, amount, type, description, date } = req.body;

  try {
    const income = await prisma.income.findUnique({ where: { id: Number(id) } });

    if (!income || income.userId !== Number(req.user.userId)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: Number(id) },
      data: {
        title: title ?? income.title,
        amount: amount !== undefined ? Number(amount) : income.amount,
        type: type ?? income.type,
        description: description ?? income.description,
        date: date ? new Date(date) : income.date,
      },
    });

    res.json(updatedIncome);
  } catch (err) {
    console.error("Erreur modification revenu:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE supprimer un revenu 
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const income = await prisma.income.findUnique({ where: { id: Number(id) } });

    if (!income || income.userId !== Number(req.user.userId)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await prisma.income.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    console.error("Erreur suppression revenu:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
