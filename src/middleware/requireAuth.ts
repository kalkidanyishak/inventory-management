// requireAuth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// It's good practice to define the JWT payload shape
interface JwtPayload {
  id: string;
  // iat and exp are automatically added by jwt
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

// Name of the cookie that stores the JWT
const JWT_COOKIE_NAME = "accessToken";

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get the token from the cookie
  const token = req.cookies[JWT_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  // 2. Verify the token
  try {
    const { JWT_ACCESS_SECRET } = process.env;
    if (!JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not defined in environment variables.");
    }

    // The core verification logic remains the same
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

    // 3. Attach user to the request object
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    // This will catch errors from jwt.verify (e.g., invalid signature, expired token)
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

export default requireAuth;