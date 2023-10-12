import { Router } from "express";
import { randomUUID } from "node:crypto";
import { readJSON } from "../utils.js";
import { validateMovie, validatePartialMovie } from "../schema/movies.js";

const MOVIES = readJSON("./data/movies.json");
export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const { genre } = req.query;

  if (genre) {
    const moviesByGenre = MOVIES.filter((movie) =>
      movie.genre.some(
        (movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase()
      )
    );
    return res.json(moviesByGenre);
  }

  res.json(MOVIES);
});

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = MOVIES.find((movie) => movie.id === id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({
      error: "Not found",
    });
  }
});

moviesRouter.post("/", (req, res) => {
  const movie = validateMovie(req.body);

  if (movie.error) {
    res.status(422).json({
      error: JSON.parse(movie.error.message),
    });
  }

  const newMovie = {
    id: randomUUID(),
    ...movie.data,
  };

  MOVIES.push(newMovie);

  res.status(201).json(newMovie);
});

moviesRouter.patch("/:id", (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (result.error) {
    res.status(422).json({
      error: JSON.parse(result.error.message),
    });
  }

  const movieIndex = MOVIES.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  const updateMovie = {
    ...MOVIES[movieIndex],
    ...result.data,
  };

  MOVIES[movieIndex] = updateMovie;

  res.json(updateMovie);
});

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = MOVIES.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      error: "Not found",
    });
  }

  MOVIES.splice(movieIndex, 1);

  return res.status(204).end();
});

moviesRouter.use((req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});
