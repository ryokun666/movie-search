import { use } from "react";
import MovieDetailClient from "./MovieDetailClient";

export default function MoviePage({ params }) {
  const movieId = use(Promise.resolve(params.id));
  return <MovieDetailClient movieId={movieId} />;
}
