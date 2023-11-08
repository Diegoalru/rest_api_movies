import express, { json } from "express";
import { createMoviesRouter } from "./routes/movies.routes.js";
import { corsMiddleware } from "./middlewares/cors.js";

export const createApp = ({ movieModel }) => {
  const PORT = process.env.PORT || 3000;
  const app = express();

  app.disable("x-powered-by");
  app.use(json());
  app.use(corsMiddleware());

  app.use("/movies", createMoviesRouter({ movieModel }));

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  return app;
};
