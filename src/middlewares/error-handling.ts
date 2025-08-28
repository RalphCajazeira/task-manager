import { AppError } from "@/utils/AppError.js";
import type { Response } from "express";

export function errorRequestHandling(error: any, response: Response) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({ message: error.message });
}
