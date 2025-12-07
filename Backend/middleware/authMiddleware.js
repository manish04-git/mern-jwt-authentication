// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  // Expected header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // get part after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: "...", iat: ..., exp: ... }

    req.user = decoded; // attach user data to req object
    next(); // go to next middleware / route handler
  } catch (error) {
    console.error("Token error:", error);
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
}
