import axios from "axios";
import type { Movie } from "../types/movie";
import toast from "react-hot-toast";

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

const errorMessage = () => toast.error("No movies found for your request.");
const myKey = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${myKey}`,
      },
    }
  );
  if (response.data.results.length === 0) {
    errorMessage();
  }

  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};
