import type { Request, Response } from "express";

class UserController {
  create(request: Request, response: Response) {
    if (process.env.NODE_ENV === "production") {
      return response.status(500).json({ message: "Internal server error" });
    }

    return response.json({ message: "User created!" });
  }
}

export { UserController };
