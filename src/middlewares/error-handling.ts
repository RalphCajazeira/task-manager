import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError, z } from "zod";
import { Prisma } from "@prisma/client";

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

  // Prisma (erros conhecidos)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // unique constraint
      return response.status(409).json({
        error: {
          message: "Resource already exists (unique constraint)",
          details: { target: (error.meta?.target as string[]) ?? undefined },
        },
      });
    }
    if (error.code === "P2025") {
      // record not found
      return response.status(404).json({
        error: { message: "Resource not found" },
      });
    }
    // fallback para demais códigos conhecidos
    return response.status(400).json({
      error: { message: `Database error (${error.code})` },
    });
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
