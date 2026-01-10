import { SearchBar } from "../SearchBar/SearchBar";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

const errorMessage = () => toast.error("No movies found for your request.");

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const closeModal = () => {
    setCurrentMovie(null);
  };

  const selectMovie = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const handleQuery = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);

      const data = await fetchMovies(query);
      if (data.length === 0) {
        errorMessage();
        return;
      }

      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleQuery} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={selectMovie} />
      )}
      {currentMovie && <MovieModal movie={currentMovie} onClose={closeModal} />}
    </>
  );
}
