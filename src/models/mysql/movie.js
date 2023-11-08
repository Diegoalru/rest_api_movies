import mysql from "mysql2/promise";
import "dotenv/config";

// Credenciales de prueba.
const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const connectionString = process.env.DATABASE_URL || DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

const SELECT_ALL_MOVIES_QUERY = `
    SELECT BIN_TO_UUID(M.id) AS id,
           M.title,
           M.\`year\`,
           M.director,
           M.duration,
           M.poster,
           M.rate
    FROM movies AS M
`;

const SELECT_MOVIES_QUERY = `
    SELECT BIN_TO_UUID(M.id) AS id,
           M.title,
           M.\`year\`,
           M.director,
           M.duration,
           M.poster,
           M.rate
    FROM movies AS M
             INNER JOIN movie_genres AS MG ON
        M.id = MG.movie_id
             INNER JOIN genres AS G ON
        MG.genre_id = G.id
    WHERE G.name like ?;
`;

const SELECT_MOVIE_BY_ID_QUERY = `
    SELECT BIN_TO_UUID(id) AS id,
           title,
           \`year\`,
           director,
           duration,
           poster,
           rate
    FROM movies
    WHERE id = UUID_TO_BIN(?);
`;

const SELECT_MOVIES_GENRES_QUERY = `
    SELECT g.name
    FROM movie_genres mg
             INNER JOIN movies m
                        ON mg.movie_id = m.id
             INNER JOIN genres g
                        ON mg.genre_id = g.id
    WHERE m.id = UUID_TO_BIN(?);
`;


/**
 * Movie model using MySQL.
 */
export class MovieModel {
  /**
   * Get all movies from the database.
   * @param {string} genre - The genre to filter by.
   * @returns {Promise<Array>} - An array of movies.
   */
  static async getAll({genre}) {
    try {
      let movies;

      if (genre) [movies] = await connection.query(SELECT_MOVIES_QUERY, [`%${genre}%`]);
      else [movies] = await connection.query(SELECT_ALL_MOVIES_QUERY);

      // Obtener los generos de las peliculas
      [movies] = await this.getGenresOfMovies(movies);

      return movies;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Función que se encarga de obtener los generos de las peliculas.
   * @param {Array} movies - Lista de peliculas
   * @returns {Promise<Array>} - Un array de generos
   */
  static async getGenresOfMovies(movies) {
    try {
      for (let movie of movies) {
        const [genres] = await connection.query(SELECT_MOVIES_GENRES_QUERY, [
          movie.id,
        ]);
        movie.genres = genres.map((genre) => genre.name);
      }
      return [movies];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Get a movie by ID.
   * @param {string} id - The ID of the movie to get.
   * @returns {Promise<Object>} - The movie object.
   */
  static async getById({id}) {
    try {
      let [movie] = await connection.query(SELECT_MOVIE_BY_ID_QUERY, [id]);

      if (movie.length === 0) {
        return null;
      }

      [movie] = await this.getGenresOfMovies(movie);

      return movie[0];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Create a new movie.
   * @param {Object} movie - The movie object to create.
   * @returns {Promise<Object>} - The created movie object.
   */
  static async create({movie}) {
    try {
      const [result] = await connection.query(
        "INSERT INTO movies (title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?);",
        [
          movie.title,
          movie.year,
          movie.director,
          movie.duration,
          movie.poster,
          movie.rate,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      const [movie] = await connection.query(
        "SELECT * FROM movies WHERE id = ?;",
        [result.insertId]
      );

      // TODO: Crear los registros en las tablas movie_genres y genres

      return movie[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Update a movie by ID.
   * @param {string} id - The ID of the movie to update.
   * @param {Object} movie - The movie object to update.
   * @returns {Promise<Object>} - The updated movie object.
   */
  static async update({id, movie}) {
    try {
      const [result] = await connection.query(
        "UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?);",
        [
          movie.title,
          movie.year,
          movie.director,
          movie.duration,
          movie.poster,
          movie.rate,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      const [movies] = await connection.query(
        "SELECT * FROM movies WHERE id = UUID_TO_BIN(?);",
        [id]
      );

      return movies[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Delete a movie by ID.
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<Object>} - The deleted movie object.
   */
  static async delete({id}) {
    try {
      const [movies] = await connection.query(
        "SELECT * FROM movies WHERE id = UUID_TO_BIN(?);",
        [id]
      );

      if (movies.length === 0) {
        return null;
      }

      const [result] = await connection.query(
        "DELETE FROM movies WHERE id = UUID_TO_BIN(?);",
        [id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return movies[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
