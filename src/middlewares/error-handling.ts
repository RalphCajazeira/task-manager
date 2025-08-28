import { AppError } from "@/utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export function errorRequestHandling(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: z.treeifyError(error),
    });
  }

  if (process.env.NODE_ENV === "production") {
    return response.status(500).json({ message: "Internal server error" });
  }

  return response.status(500).json({
    message: error instanceof Error ? error.message : "Unknown error",
  });
}
