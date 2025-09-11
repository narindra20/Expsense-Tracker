import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET toutes les catégories de l'utilisateur connecté
router.get("/", authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: Number(req.user.userId) },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST nouvelle catégorie
router.post("/", authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Nom requis" });

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description: description || "",
        userId: Number(req.user.userId),
      },
    });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT modifier catégorie
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category || category.userId !== Number(req.user.userId))
      return res.status(403).json({ error: "Accès refusé" });

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE catégorie
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category || category.userId !== Number(req.user.userId))
      return res.status(403).json({ error: "Accès refusé" });

    await prisma.category.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;