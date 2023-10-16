import { MovieModel } from "../models/mongodb/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movie.js";

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });

    res.status(200).json({ message: "Movies found", movies: movies });
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({ message: "Movie found", movie: movie });
  }

  static async create(req, res) {
    const movie = validateMovie(req.body);

    if (movie.error) {
      res.status(422).json({
        message: JSON.parse(movie.error.message),
      });
    }
    const newMovie = await MovieModel.create({ movie: movie.data });

    res.status(201).json({ message: "Movie created", movie: newMovie });
  }

  static async update(req, res) {
    const movie = validatePartialMovie(req.body);

    if (movie.error) {
      // 422: Unprocessable Entity
      res.status(422).json({
        message: JSON.parse(movie.error.message),
      });
    }

    const { id } = req.params;

    const updateMovie = await MovieModel.update({ id, movie: movie.data });

    if (!updateMovie) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    res.status(200).json({ message: "Movie updated", movie: updateMovie });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const deletedMovie = await MovieModel.delete({ id });

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({ mesage: "Movie deleted", movie: deletedMovie });
  }
}
