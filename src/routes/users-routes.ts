import { Router } from "express";

import { UserController } from "@/controllers/users-controller.js";

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.post("/", userController.create);
usersRoutes.get("/:id", userController.show);

export { usersRoutes };
