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

    const teamAlreadyExists = await prisma.team.findFirst({
      where: { name },
    });

    if (teamAlreadyExists) {
      throw new AppError("Team already exists.", 409);
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    return response.json({ data: team });
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany();

    return response.json({ data: teams });
  }
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = paramsSchema.parse(request.params);

    const team = await prisma.team.findUnique({
      where: { id },
    });

    return response.json({ data: team });
  }
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string().trim().min(2),
    });

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.team.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return response.json({ data: team });
  }
  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });
    const { id } = paramsSchema.parse(request.params);

    await prisma.team.delete({
      where: { id },
    });

    return response.json({ message: "Team deleted successfully." });
  }
}

export { TeamController };
