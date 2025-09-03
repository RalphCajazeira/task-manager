import { Request, Response } from "express";
import { z } from "zod";

class SessionsControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email().trim(),
      password: z.string().trim().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    return response.json({ data: { email, password } });
  }
}

export { SessionsControllers };
