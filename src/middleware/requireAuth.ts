import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_ACCESS_SECRET } = process.env;

export interface AuthRequest extends Request {
  user?: { id: string };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as any, JWT_ACCESS_SECRET!) as any;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

export default requireAuth;