import jwt from "jsonwebtoken";

// Clé secrète pour vérifier le JWT
const JWT_SECRET = "Fitiavana"; 

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token requis" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token invalide" });
    }
    req.user = user;
    next();
  });
};