import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" }); // répertoire pour les reçus

// =================== GET /api/expenses ===================
router.get("/", authenticateToken, async (req, res) => {
  const { start, end, category, type } = req.query;
  const where = { userId: req.user.userId };

  if (category) where.categoryId = parseInt(category);
  if (type) where.type = type;
  if (start || end) {
    where.date = {};
    if (start) where.date.gte = new Date(start);
    if (end) where.date.lte = new Date(end);
  }

  try {
    const expenses = await prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =================== GET /api/expenses/:id ===================
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await prisma.expense.findFirst({
      where: { id: parseInt(id), userId: req.user.userId },
      include: { category: true },
    });
    if (!expense) return res.status(404).json({ message: "Dépense non trouvée" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =================== POST /api/expenses ===================
router.post("/", authenticateToken, upload.single("receipt"), async (req, res) => {
  const { amount, date, categoryId, description, type, startDate, endDate } = req.body;

  if (!amount || !categoryId) {
    return res.status(400).json({ message: "Montant et catégorie requis" });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        date: date ? new Date(date) : null,
        categoryId: parseInt(categoryId),
        description: description || null,
        type: type || "ponctuelle",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        receipt: req.file ? req.file.path : null,
        userId: req.user.userId,
      },
    });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =================== PUT /api/expenses/:id ===================
router.put("/:id", authenticateToken, upload.single("receipt"), async (req, res) => {
  const { id } = req.params;
  const { amount, date, categoryId, description, type, startDate, endDate } = req.body;

  try {
    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        description: description || undefined,
        type: type || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        receipt: req.file ? req.file.path : undefined,
      },
    });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =================== DELETE /api/expenses/:id ===================
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Dépense supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
