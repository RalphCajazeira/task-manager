import { Router } from "express";
import { TeamController } from "@/controllers/teams-controllers";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const teamsRoutes = Router();
const teamController = new TeamController();

teamsRoutes.post("/", ensureAuthenticated, teamController.create);
teamsRoutes.get("/", ensureAuthenticated, teamController.index);
teamsRoutes.get("/:id/show", ensureAuthenticated, teamController.show);
teamsRoutes.put("/:id", ensureAuthenticated, teamController.update);
teamsRoutes.delete("/:id", ensureAuthenticated, teamController.delete);

export { teamsRoutes };
