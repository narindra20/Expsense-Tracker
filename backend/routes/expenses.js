import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

// ================== UPLOAD CONFIG (reçus) ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/receipts"); // dossier où enregistrer les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ================== GET toutes les dépenses (avec filtres) ==================
router.get("/", async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) return res.status(400).json({ error: "userId requis" });

    const { start, end, category, type } = req.query;

    const filters = { userId };

    if (category) filters.categoryId = parseInt(category);
    if (type) filters.type = type;
    if (start && end) {
      filters.date = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const expenses = await prisma.expense.findMany({
      where: filters,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Formatter les catégories pour le front
    const formatted = expenses.map((e) => ({
      ...e,
      category: e.category.name,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du chargement des dépenses" });
  }
});

// ================== GET une dépense par ID ==================
router.get("/:id", async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });

    if (!expense) return res.status(404).json({ error: "Dépense introuvable" });

    res.json({ ...expense, category: expense.category.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
});

// ================== POST créer une dépense ==================
router.post("/", upload.single("receipt"), async (req, res) => {
  try {
    const {
      title,
      amount,
      categoryId,
      type,
      date,
      startDate,
      endDate,
      description,
      userId,
    } = req.body;

    if (!title || !amount || !categoryId || !type || !userId) {
      return res.status(400).json({ error: "Informations manquantes" });
    }

    const expenseData = {
      title,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      type,
      description: description || "",
      userId: parseInt(userId),
      receipt: req.file ? req.file.filename : null,
    };

    if (type === "Ponctuelle") {
      expenseData.date = date ? new Date(date) : null;
    } else if (type === "Récurrente") {
      expenseData.startDate = startDate ? new Date(startDate) : null;
      expenseData.endDate = endDate ? new Date(endDate) : null;
    }

    const expense = await prisma.expense.create({
      data: expenseData,
      include: { category: true },
    });

    res.status(201).json({ ...expense, category: expense.category.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la dépense" });
  }
});

// ================== PUT modifier une dépense ==================
router.put("/:id", upload.single("receipt"), async (req, res) => {
  try {
    const {
      title,
      amount,
      categoryId,
      type,
      date,
      startDate,
      endDate,
      description,
    } = req.body;

    const updatedData = {
      title,
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      type,
      description: description || "",
    };

    if (req.file) updatedData.receipt = req.file.filename;

    if (type === "Ponctuelle") {
      updatedData.date = date ? new Date(date) : null;
      updatedData.startDate = null;
      updatedData.endDate = null;
    } else if (type === "Récurrente") {
      updatedData.startDate = startDate ? new Date(startDate) : null;
      updatedData.endDate = endDate ? new Date(endDate) : null;
      updatedData.date = null;
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(req.params.id) },
      data: updatedData,
      include: { category: true },
    });

    res.json({ ...expense, category: expense.category.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
});

// ================== DELETE supprimer une dépense ==================
router.delete("/:id", async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;
