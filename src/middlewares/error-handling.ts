import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError, z } from "zod";

export function errorRequestHandling(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ error: { message: error.message } });
  }

  if (error instanceof ZodError) {
    const details = z.flattenError(error);

    return response
      .status(400)
      .json({ error: { message: "Validation error", details } });
  }

  if (process.env.NODE_ENV === "production") {
    return response
      .status(500)
      .json({ error: { message: "Internal server error" } });
  }

  // Em dev/test, exponha detalhes para facilitar debug
  const message = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : undefined;

  return response.status(500).json({
    error: { message, stack },
  });
}
