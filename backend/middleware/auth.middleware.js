const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getTokenFromHeader = (req) => {
  const header = req.headers.authorization;
  return header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
};

// Blocks the request if there's no valid token — used for /history and /auth/me
const protect = async (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    next();
  } catch {
    return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

// Attaches req.user if a valid token exists, but never blocks — used for /review
// so guests keep full reviewer access; logged-in users additionally get history saved
const optionalAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // invalid/expired token on an optional route just means "treat as guest"
  }

  next();
};

module.exports = { protect, optionalAuth };