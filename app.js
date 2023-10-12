import express, { json } from "express";
import { moviesRouter } from "./routes/movies.routes";
import { corsMiddleware } from "./middlewares/cors";

const PORT = process.env.PORT || 3000;
const app = express();

app.disable("x-powered-by");
app.use(json());
app.use(corsMiddleware());

app.use("/movies", moviesRouter)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
