import mysql from "mysql2/promise";

// Credenciales de prueba.
const config = {
  host: "localhost",
  port: "3306",
  user: "moviesdb",
  password: "moviesdb",
  database: "moviesdb",
};

const connection = await mysql.createConnection(config);

const SELECT_MOVIES_QUERY = `
SELECT
  M.id,
  M.title,
  M.\`year\`,
  M.director,
  M.duration,
  M.poster,
  M.rate
FROM
  movies AS M
  INNER JOIN movie_genres AS MG ON
    M.id = MG.movie_id
  INNER JOIN genres AS G ON
    MG.genre_id = G.id
WHERE G.name like ?;
`;

const SELECT_MOVIES_GENRES_QUERY = `
  SELECT g.name 
  FROM movie_genres mg 
	  INNER JOIN movies m 
	  ON mg.movie_id = m.id 
	  INNER JOIN genres g 
	  ON mg.genre_id = g.id
  WHERE m.id = ?;
`;

/**
 * Map movie results to a more friendly format.
 * @param {Array} movies - The movies to map.
 * @returns {Array} - The mapped movies.
 */
function mapMovieResults(movies) {
  return movies.map((item) => ({
    ...item,
    id: item.id.toString("utf8"),
  }));
}

export class MovieModel {
  /**
   * Get all movies from the database.
   * @param {string} genre - The genre to filter by.
   * @returns {Promise<Array>} - An array of movies.
   */
  static async getAll({ genre }) {
    try {
      let movies;

      if (genre)
        [movies] = await connection.query(SELECT_MOVIES_QUERY, [`%${genre}%`]);
      else 
        [movies] = await connection.query("SELECT * FROM movies;");
      
      // Obtener los generos de las peliculas
      [movies] = await this.getGenresOfMovies(movies)

      return mapMovieResults(movies);
    } catch (error) {
      console.error(error);
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
        const [genres] = await connection.query(SELECT_MOVIES_GENRES_QUERY, [movie.id]);
        movie.genres = genres.map(genre => genre.name)
      }
      return [movies]      
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
  static async getById({ id }) {
    try {
      let [movie] = await connection.query(
        "SELECT * FROM movies WHERE id = ?;",
        [id]
      );

      if (movie.length === 0) {
        return null;
      }

      [movie] = await this.getGenresOfMovies(movie)

      return mapMovieResults(movie)[0];
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
  static async create({ movie }) {
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

      const [movies] = await connection.query(
        "SELECT * FROM movies WHERE id = ?;",
        [result.insertId]
      );

      // TODO: Crear los registros en las tablas movie_genres y genres

      return mapMovieResults(movies)[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Crea un registro en la tabla movie_genres

  /**
   * Update a movie by ID.
   * @param {string} id - The ID of the movie to update.
   * @param {Object} movie - The movie object to update.
   * @returns {Promise<Object>} - The updated movie object.
   */
  static async update({ id, movie }) {
    try {
      const [result] = await connection.query(
        "UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = ?;",
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
        "SELECT * FROM movies WHERE id = ?;",
        [id]
      );

      return mapMovieResults(movies)[0];
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
  static async delete({ id }) {
    try {
      const [movies] = await connection.query(
        "SELECT * FROM movies WHERE id = ?;",
        [id]
      );

      if (movies.length === 0) {
        return null;
      }

      const [result] = await connection.query(
        "DELETE FROM movies WHERE id = ?;",
        [id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return mapMovieResults(movies)[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
