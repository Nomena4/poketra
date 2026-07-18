module.exports = function authMiddleware(req, res, next) {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};
