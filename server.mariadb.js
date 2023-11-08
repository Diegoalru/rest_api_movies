import { createApp } from "./src/app.js";

import { MovieModel } from "./src/models/mariadb/movie.js";

createApp({ movieModel: MovieModel });