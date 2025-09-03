import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.email().toLowerCase().trim(),
      password: z.string().trim().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User with this email already exists.", 409);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ data: userWithoutPassword });
  }

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.json({ data: users });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return response.json({ data: user });
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive(),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(2).optional(),
      email: z.email().optional(),
      password: z.string().trim().min(6).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { name, email, password } = bodySchema.parse(request.body);
  }
}

export { UserController };
