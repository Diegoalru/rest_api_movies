import { createApp } from "./app.js";

import { MovieModel } from "./models/mariadb/movie.js";

createApp({ movieModel: MovieModel });