const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    // Try to get token from httpOnly cookie first
    let token = req.cookies.token;

    // Fallback to Authorization header for backward compatibility
    if (!token) {
      const auth = req.headers.authorization || "";
      const [, authToken] = auth.split(" ");
      token = authToken;
    }

    if (!token) return res.status(401).json({ message: "Unauthenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET); // { userId, isAdmin, department, iat, exp }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
