import { Router } from "express";
import { MovieController } from "../controllers/movies.controller.js";

export const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);
moviesRouter.post("/", MovieController.create);

moviesRouter.get("/:id", MovieController.getById);
moviesRouter.patch("/:id", MovieController.update);
moviesRouter.delete("/:id", MovieController.delete);

moviesRouter.use((req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});
