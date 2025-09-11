import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET toutes les dépenses de l'utilisateur connecté AVEC LES CATÉGORIES
router.get("/", authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(req.user.userId) },
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });
    res.json(expenses);
  } catch (err) {
    console.error("Erreur récupération dépenses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST nouvelle dépense
router.post("/", authenticateToken, async (req, res) => {
  const { title, amount, type, description, categoryId, date, startDate, endDate, receipt } = req.body;

  if (!title || !amount || !type || !categoryId) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id: Number(categoryId) } });
    if (!category || category.userId !== Number(req.user.userId)) {
      return res.status(400).json({ message: "Catégorie invalide" });
    }

    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: Number(amount),
        type,
        description: description || "",
        categoryId: Number(categoryId),
        date: date ? new Date(date) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        receipt: receipt || null,
        userId: Number(req.user.userId),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Erreur création dépense:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT modifier une dépense
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, amount, type, description, categoryId, date, startDate, endDate } = req.body;

  try {
    const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
    if (!expense || expense.userId !== Number(req.user.userId)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        title: title ?? expense.title,
        amount: amount !== undefined ? Number(amount) : expense.amount,
        type: type ?? expense.type,
        description: description ?? expense.description,
        categoryId: categoryId !== undefined ? Number(categoryId) : expense.categoryId,
        date: date ? new Date(date) : expense.date,
        startDate: startDate ? new Date(startDate) : expense.startDate,
        endDate: endDate ? new Date(endDate) : expense.endDate,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    res.json(updatedExpense);
  } catch (err) {
    console.error("Erreur modification dépense:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE supprimer une dépense
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
    if (!expense || expense.userId !== Number(req.user.userId)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await prisma.expense.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    console.error("Erreur suppression dépense:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;