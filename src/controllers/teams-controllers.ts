import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class TeamController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string().trim().min(2),
    });

    const { name, description } = bodySchema.parse(request.body);

    return response.json({ data: { name, description } });
  }

  async index(request: Request, response: Response) {}
  async show(request: Request, response: Response) {}
  async update(request: Request, response: Response) {}
  async delete(request: Request, response: Response) {}
}

export { TeamController };
