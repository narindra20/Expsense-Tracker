import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Liste des dépenses
router.get("/", async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ message: "userId requis" });

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true }
    });
    res.json(expenses.map(e => ({
      ...e,
      category: e.category.name,
      categoryId: e.category.id
    })));
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter une dépense
router.post("/", async (req, res) => {
  const { title, amount, categoryId, description, type, date, startDate, endDate, userId } = req.body;
  if (!title || !amount || !categoryId || !userId) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        description,
        type,
        date: type === "Ponctuelle" ? new Date(date) : null,
        startDate: type === "Récurrente" ? new Date(startDate) : null,
        endDate: type === "Récurrente" ? new Date(endDate) : null,
        categoryId: parseInt(categoryId),
        userId: parseInt(userId)
      }
    });

    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    res.status(201).json({ ...newExpense, category: category.name });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création" });
  }
});

// Modifier uniquement le montant
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;

  try {
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { amount: parseFloat(amount) },
      include: { category: true }
    });

    res.json({ ...updatedExpense, category: updatedExpense.category.name });
  } catch (error) {
    console.error("Erreur modification:", error);
    res.status(404).json({ message: "Dépense non trouvée" });
  }
});

// Supprimer une dépense
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.expense.delete({ where: { id } });
    res.json({ message: "Supprimé" });
  } catch (error) {
    res.status(404).json({ message: "Dépense non trouvée" });
  }
});

export default router;
