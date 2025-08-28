import express from "express";
import { errorRequestHandling } from "./middlewares/error-handling.js";

const app = express();

app.use(express.json());

app.use(errorRequestHandling);

export { app };
