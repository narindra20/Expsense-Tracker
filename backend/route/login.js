const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const router = express.Router();
const SECRET = "supersecretkey"; 

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const userExist = await prisma.user.findUnique({ where: { email } });

    if (userExist) {
      return res.status(400).json({ error: "Utilisateur déjà existant" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: "1h" });

    res.json({
      message: "Utilisateur créé avec succès",
      token,
      redirectTo: "/dashboard"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "le mot de passe ou le username est fausse" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "le mot de passe ou le username est fausse" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

    res.json({
      message: "Connexion réussie",
      token,
      redirectTo: "/dashboard"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


router.get("/me", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Pas de token fourni" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Bienvenue utilisateur", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
});

module.exports = router;
