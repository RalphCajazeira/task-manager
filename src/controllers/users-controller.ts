import type { Request, Response } from "express";
import { hash } from "bcrypt";
import { z } from "zod";

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.email(),
      password: z.string().trim().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const hashedPassword = await hash(password, 8);

    return response.json({ name, email, hashedPassword });
  }
}

export { UserController };
