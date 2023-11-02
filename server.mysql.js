import { createApp } from "./src/app.js";

import { MovieModel } from "./src/models/mysql/movie.js";

createApp({ movieModel: MovieModel });