// middleware/middleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "Fitiavana";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token manquant" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Token invalide" });
      if (!user || !user.userId)
        return res.status(403).json({ message: "Token invalide (userId manquant)" });

      req.user = user;
      next();
    });
  } catch (err) {
    console.error("Erreur authenticateToken :", err);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};
