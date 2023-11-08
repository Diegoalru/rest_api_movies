import { createApp } from "./src/app.js";

import { MovieModel } from "./src/models/mongodb/movie.js";

createApp({ movieModel: MovieModel });