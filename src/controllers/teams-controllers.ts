import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { id } from "zod/v4/locales/index.cjs";

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

    return response.json({
      message: `Team has been ${id} deleted successfully.`,
    });
  }

  async addMember(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = paramsSchema.parse(request.params);

    const team = await prisma.team.findUnique({
      where: { id },
    });

    const bodySchema = z.object({
      userId: z.number().int().positive(),
    });

    const { userId } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const memberAlreadyExists = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId,
      },
    });

    if (!user || !team) {
      throw new AppError("User or team not found.", 404);
    }

    if (memberAlreadyExists) {
      throw new AppError("User is already a member of the team.", 409);
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId,
      },
    });

    return response.json({ data: teamMember });
  }

  async removeMember(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
      userId: z.coerce.number().int().positive(),
    });

    const { id, userId } = paramsSchema.parse(request.params);

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: id,
        userId,
      },
    });

    if (!teamMember) {
      throw new AppError("Team member not found.", 404);
    }

    await prisma.teamMember.delete({
      where: { id: teamMember.id },
    });

    return response.json();
  }

  async listMembers(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });
    const { id } = paramsSchema.parse(request.params);

    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: id },
      include: {
        team: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    return response.json({ data: teamMembers });
  }
}

export { TeamController };
