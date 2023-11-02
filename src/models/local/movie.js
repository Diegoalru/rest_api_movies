import { readJSON } from "../../utils.js";
import { randomUUID } from "node:crypto";

const MOVIES = readJSON("./data/movies.json");

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return MOVIES.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    return MOVIES;
  }

  static async getById({ id }) {
    return MOVIES.find((movie) => movie.id === id);
  }

  static async create({ movie }) {
    const newMovie = {
      id: randomUUID(),
      ...movie,
    };

    MOVIES.push(newMovie);

    return newMovie;
  }

  static async update({ id, movie }) {
    const movieIndex = MOVIES.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
      return null;
    }

    MOVIES[movieIndex] = {
      ...MOVIES[movieIndex],
      ...movie,
    };

    return MOVIES[movieIndex];
  }

  static async delete({ id }) {
    const movieIndex = MOVIES.findIndex((movie) => movie.id === id);

    const deletedMovie = MOVIES[(movieIndex, 1)];

    return deletedMovie;
  }
}
