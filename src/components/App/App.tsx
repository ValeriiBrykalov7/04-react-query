import { SearchBar } from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";

import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

const errorMessage = () => toast.error("No movies found for your request.");
export default function App() {
  const [query, setQuery] = useState("");
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const closeModal = () => {
    setCurrentMovie(null);
  };

  const selectMovie = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const handleQuery = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      errorMessage();
    }
  }, [isSuccess, data]);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <SearchBar onSubmit={handleQuery} />
      {movies.length > 0 && totalPages > 0 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={selectMovie} />
      )}
      {currentMovie && <MovieModal movie={currentMovie} onClose={closeModal} />}
    </>
  );
}
