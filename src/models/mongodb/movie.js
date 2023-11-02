import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
    const database = client.db("movies");
    return database.collection("movies");
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    await client.close();
  }
}

export class MovieModel {
  /**
   * Get all movies from the database.
   * @param {string} genre - The genre to filter by.
   * @returns {Promise<Array>} - An array of movies.
   */
  static async getAll({ genre }) {
    const movieCollection = await connect();

    if (genre) {
      return await movieCollection
        .find({
          genre: {
            $elemMatch: {
              $regex: genre,
              $options: "i", // case insensitive
            },
          },
        })
        .toArray();
    }

    const movies = await movieCollection.find({}).toArray();
    return movies;
  }

  /**
   * Get a movie by ID.
   * @param {string} id - The ID of the movie to get.
   * @returns {Promise<Object>} - The movie object.
   */
  static async getById({ id }) {
    const movieCollection = await connect();
    const movieId = new ObjectId(id);
    return movieCollection.findOne({ _id: movieId });
  }

  /**
   * Create a new movie.
   * @param {Object} movie - The movie object to create.
   * @returns {Promise<Object>} - The created movie object.
   */
  static async create({ movie }) {
    const movieCollection = await connect();
    const { insertedId } = await movieCollection.insertOne(movie);

    return {
      id: insertedId,
      ...movie,
    };
  }

  /**
   * Update a movie by ID.
   * @param {string} id - The ID of the movie to update.
   * @param {Object} movie - The movie object to update.
   * @returns {Promise<Object>} - The updated movie object.
   */
  static async update({ id, movie }) {
    const movieCollection = await connect();
    const movieId = new ObjectId(id);

    const { ok, value } = await movieCollection.findOneAndUpdate(
      { _id: movieId },
      { $set: movie },
      { returnNewDocument: true }
    );

    if (!ok) {
      return null;
    }

    return value;
  }

  /**
   * Delete a movie by ID.
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<Object>} - The deleted movie object.
   */
  static async delete({ id }) {
    try {
      const movieCollection = await connect();

      const movieId = new ObjectId(id);

      // return deleted document
      const movieDeleted = await movieCollection.findOneAndDelete(
        { _id: movieId }, { returnDocument: true }
      );

      return movieDeleted;
    } catch (error) {
      console.error(`Error deleting movie: ${error}`);
      return null;
    }
  }
}
