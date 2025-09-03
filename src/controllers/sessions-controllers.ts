import { Request, Response } from "express";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { z } from "zod";

class SessionsControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email().trim(),
      password: z.string().trim(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (!user) {
      throw new AppError("Email or password incorrect", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Email or password incorrect", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role ?? "member" }, secret, {
      subject: String(user.id),
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token });
  }
}

export { SessionsControllers };
