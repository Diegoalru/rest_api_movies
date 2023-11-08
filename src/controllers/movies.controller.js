import { validateMovie, validatePartialMovie } from "../schemas/movie.js";

export class MovieController {

  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    try {
      const { genre } = req.query;
      const movies = await this.movieModel.getAll({ genre });
      res.status(200).json({ message: "Movies found", movies: movies });
    } catch (error) {
      res.status(500).json({ message: "Error while getting movies" });
    }
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({ message: "Movie found", movie: movie });
  }

  create = async (req, res) => {
    const movie = validateMovie(req.body);

    if (movie.error) {
      res.status(422).json({
        message: JSON.parse(movie.error.message),
      });
    }
    const newMovie = await this.movieModel.create({ movie: movie.data });

    if (!newMovie) {
      return res.status(409).json({
        message: "Error while creating movie",
      });
    }

    res.status(201).json({ message: "Movie created", movie: newMovie });
  }

  update = async (req, res) => {
    const movie = validatePartialMovie(req.body);

    if (movie.error) {
      // 422: Unprocessable Entity
      res.status(422).json({
        message: JSON.parse(movie.error.message),
      });
    }

    const { id } = req.params;

    const updateMovie = await this.movieModel.update({ id, movie: movie.data });

    if (!updateMovie) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    res.status(200).json({ message: "Movie updated", movie: updateMovie });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const deletedMovie = await this.movieModel.delete({ id });

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({ mesage: "Movie deleted", movie: deletedMovie });
  }
}
