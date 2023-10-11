const z = require("zod");

const movieSchema = z.object({
  title: z
    .string({
      message: "Title must be a string",
      required_error: "Title is required",
    })
    .min(1)
    .max(255),
  year: z
    .number({
      message: "Year must be a number",
      required_error: "Year is required",
    })
    .int()
    .positive()
    .min(1888)
    .max(2024),
  director: z
    .string({
      message: "Director must be a string",
      required_error: "Director is required",
    })
    .min(1)
    .max(255),
  duration: z
    .number({
      message: "Duration must be a number",
      required_error: "Duration is required",
    })
    .int()
    .positive()
    .min(1)
    .max(500),
  poster: z
    .string({
      message: "Poster must be a string",
      required_error: "Poster is required",
    })
    .url(),
  rate: z
    .number({
      message: "Rate must be a number",
      required_error: "Rate is required",
    })
    .positive()
    .min(0)
    .max(10)
    .default(0),
  genre: z
    .array(
      z.enum([
        "Drama",
        "Action",
        "Crime",
        "Adventure",
        "Sci-Fi",
        "Romance",
        "Biography",
        "Fantasy",
      ]),
      {
        message: "Genre must be an array of strings",
        required_error: "Genre is required",
      }
    )
    .min(1)
    .max(3),
});

function validateMovie(object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
};
