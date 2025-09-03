import { Request, Response, NextFunction } from "express";
import { verify, type JwtPayload } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new AppError("JWT token not found", 401);

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid Authorization header", 401);
    }

    const decoded = verify(token, authConfig.jwt.secret) as TokenPayload;
    const { role, sub: user_id } = decoded;

    request.user = { id: user_id, role };

    if (role !== "admin") {
      throw new AppError("Insufficient permissions", 403);
    }

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // preserva 403, 404, etc.
    }
    throw new AppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };
