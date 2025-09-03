import { Router } from "express";

import { UserController } from "@/controllers/users-controller.js";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.post("/", userController.create);
usersRoutes.get("/",ensureAuthenticated, userController.index);
usersRoutes.get("/:id", userController.show);

export { usersRoutes };
