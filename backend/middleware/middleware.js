import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Fitiavana";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    if (!user.userId) return res.status(403).json({ message: "Token invalide (userId manquant)" });
    req.user = user; // contient userId
    next();
  });
}