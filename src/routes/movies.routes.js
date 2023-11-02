import { Router } from "express";
import { MovieController } from "../controllers/movies.controller.js";

export const createMoviesRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  const movieController = new MovieController({ movieModel });

  moviesRouter.get("/", movieController.getAll);
  moviesRouter.post("/", movieController.create);

  moviesRouter.get("/:id", movieController.getById);
  moviesRouter.patch("/:id", movieController.update);
  moviesRouter.delete("/:id", movieController.delete);

  moviesRouter.use((req, res) => {
    res.status(404).json({
      error: "Not found",
    });
  });

  return moviesRouter;
};
