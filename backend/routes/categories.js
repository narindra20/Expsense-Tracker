// /backend/routes/categories.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Récupérer toutes les catégories d'un utilisateur
router.get("/", async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) return res.status(400).json({ error: "userId requis" });

    const categories = await prisma.category.findMany({ where: { userId } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

// Ajouter une catégorie
router.post("/", async (req, res) => {
  const { name, description, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ error: "Nom et userId requis" });

  try {
    const category = await prisma.category.create({ data: { name, description, userId } });
    res.status(201).json(category);
  } catch {
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
});

// Modifier une catégorie
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
});

// Supprimer une catégorie
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;
