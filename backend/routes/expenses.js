import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/middleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/receipts";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
  if (!allowed.includes(path.extname(file.originalname).toLowerCase())) return cb(new Error("Format non supporté"));
  cb(null, true);
}});

router.get("/", authenticateToken, async (req, res) => {
  const expenses = await prisma.expense.findMany({ where: { userId: Number(req.user.userId) }, orderBy: { date: "desc" }, include: { category: true } });
  res.json(expenses);
});

router.post("/", authenticateToken, upload.single("receipt"), async (req, res) => {
  const { title, amount, type, categoryId, date, startDate, endDate, description } = req.body;
  if (!title || !amount || !type || !categoryId) return res.status(400).json({ message: "Champs obligatoires manquants" });
  const newExpense = await prisma.expense.create({ data: { title, amount: Number(amount), type, categoryId: Number(categoryId), date: date ? new Date(date) : null, startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null, description: description || "", receipt: req.file ? req.file.filename : null, userId: Number(req.user.userId) }, include: { category: true } });
  res.status(201).json(newExpense);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
  if (!expense || expense.userId !== Number(req.user.userId)) return res.status(403).json({ message: "Accès refusé" });
  const updated = await prisma.expense.update({ where: { id: Number(id) }, data: { amount: Number(amount) }, include: { category: true } });
  res.json(updated);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
  if (!expense || expense.userId !== Number(req.user.userId)) return res.status(403).json({ message: "Accès refusé" });
  if (expense.receipt) { const filePath = path.join("./uploads/receipts", expense.receipt); if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }
  await prisma.expense.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

router.get("/receipts/:idExpense", authenticateToken, async (req, res) => {
  const { idExpense } = req.params;
  const expense = await prisma.expense.findUnique({ where: { id: Number(idExpense) } });
  if (!expense || expense.userId !== Number(req.user.userId)) return res.status(403).json({ message: "Accès refusé" });
  if (!expense.receipt) return res.status(404).json({ message: "Aucun reçu" });
  const filePath = path.join("./uploads/receipts", expense.receipt);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Fichier introuvable" });
  res.download(filePath, expense.receipt);
});

export default router;
