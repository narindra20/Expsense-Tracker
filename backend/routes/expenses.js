// /backend/routes/expenses.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Récupérer toutes les dépenses d'un utilisateur
router.get("/", async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) return res.status(400).json({ error: "userId requis" });

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true }, // inclure infos catégorie
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du chargement des dépenses" });
  }
});

// Ajouter une dépense
router.post("/", async (req, res) => {
  try {
    const { title, amount, categoryId, type, date, startDate, endDate, description, userId } = req.body;

    if (!title || !amount || !categoryId || !type || !userId) {
      return res.status(400).json({ error: "Informations manquantes" });
    }

    const expenseData = {
      title,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      type,
      description: description || "",
      userId,
    };

    if (type === "Ponctuelle") {
      expenseData.date = date;
    } else if (type === "Récurrente") {
      expenseData.startDate = startDate;
      expenseData.endDate = endDate || null;
    }

    const expense = await prisma.expense.create({ data: expenseData });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la dépense" });
  }
});

// Modifier une dépense
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, categoryId, type, date, startDate, endDate, description } = req.body;

    const updatedData = {
      title,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      type,
      description,
    };

    if (type === "Ponctuelle") {
      updatedData.date = date;
      updatedData.startDate = null;
      updatedData.endDate = null;
    } else if (type === "Récurrente") {
      updatedData.startDate = startDate;
      updatedData.endDate = endDate || null;
      updatedData.date = null;
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la modification de la dépense" });
  }
});

// Supprimer une dépense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
});

export default router;
