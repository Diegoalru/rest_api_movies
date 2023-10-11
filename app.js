const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const z = require("zod");

const { validateMovie, validatePartialMovie } = require("./schema/movies");

const MOVIES = require("./data/movies.json");
const PORT = process.env.PORT || 3000;
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:8080"];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.get("/movies", (req, res) => {
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

app.get("/movies/:id", (req, res) => {
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

app.post("/movies", (req, res) => {
  const movie = validateMovie(req.body);

  if (movie.error) {
    res.status(422).json({
      error: JSON.parse(movie.error.message),
    });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...movie.data,
  };

  MOVIES.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
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

app.delete("/movies/:id", (req, res) => {
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

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
