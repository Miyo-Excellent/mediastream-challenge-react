/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 *
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { capitalize, sortBy, toUpper, uniq } from "lodash";

import wallpaper from "./assets/mountains.jpeg";

import "./assets/styles.css";

export function Loading({ fetchCount }) {
  return (
    <div className="movie-library__loading">
      <p>Loading...</p>
      <p>Fetched {fetchCount} times</p>
    </div>
  );
}

export function Movie({ key, id, title, posterUrl, year, runtime, genres }) {
  return (
    <li key={key} className="movie-library__card">
      <div className="movie-library__card--poster">
        <img src={posterUrl} alt={title} />
      </div>

      <ul className="movie-library__card--info">
        <li className="movie-library__card--info--title">Title: {title}</li>
        <li className="movie-library__card--info--year">Year: {year}</li>
        <li className="movie-library__card--info--runtime">
          Runtime: {runtime}
        </li>
        <li className="movie-library__card--info--genres">
          Genres: {genres.join(", ")}
        </li>
      </ul>
    </li>
  );
}

export function SearchBar({
  onChangeOrder,
  descending = false,
  genre,
  genres = [],
  onChangeGenre,
}) {
  return (
    <div className="movie-library__actions">
      <select
        name="genre"
        placeholder="Search by genre..."
        onChange={onChangeGenre}
        value={genre}
      >
        {genres.map((_genre) => (
          <option key={nanoid()} value={toUpper(_genre)}>
            {capitalize(_genre)}
          </option>
        ))}
      </select>
      <button onClick={onChangeOrder}>
        Order {descending ? "Descending" : "Ascendant "}
      </button>
    </div>
  );
}

export default function Exercise02() {
  const [movies, setMovies] = useState([]);
  const [moviesFiltered, setMoviesFiltered] = useState([]);
  const [genre, setGenre] = useState("all");
  const [fetchCount, setFetchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [descendingOrder, setDescendingOrder] = useState(true);

  const noFilter = /all/gi.test(genre);

  const genres = uniq(
    movies.reduce(
      (collection, { genres: movieGenres }) => [
        "All",
        ...collection,
        ...movieGenres,
      ],
      []
    )
  );

  const handleMovieFetch = async () => {
    try {
      setLoading(true);

      setFetchCount(fetchCount + 1);

      console.log("Getting movies");

      const movies = await getMovies();

      setMovies(movies);
      setLoading(false);
    } catch (error) {
      console.log("Run yarn movie-api for fake api", error);
    }
  };

  const getMovies = async () => {
    try {
      console.log("Getting movies");

      const movies = await fetch("http://localhost:3001/movies?_limit=50");

      const movieJson = await movies.json();

      return movieJson;
    } catch (error) {
      console.log("Run yarn movie-api for fake api", error);
      return [];
    }
  };

  const getMoviesByGenre = async (genre = "") => {
    if (!genre) {
      console.log("The selected gender type is not valid. ");
      alert("The selected gender type is not valid. ");

      return;
    }

    try {
      if (/^all$/gi.test(genre)) {
        setMovies(movies);
        return;
      }

      const _moviesFiltered = movies.filter(({ genres: movieGenres }) => {
        const hasGenre = !!movieGenres.find((_genre) =>
          new RegExp(genre, "gi").test(_genre)
        );

        return !!hasGenre;
      });

      setMoviesFiltered(_moviesFiltered);
    } catch (error) {
      console.log(
        "An unexpected error occurred when trying to request movies with a specific genre. ",
        error
      );
      alert(
        "An unexpected error occurred when trying to request movies with a specific genre. "
      );
    }
  };

  const onChangeGenre = async ({ target }) => {
    setGenre(target.value);
    await getMoviesByGenre(target.value);
  };

  const moviesFiltres = sortBy(noFilter ? movies : moviesFiltered, ["year"]);

  const movieOrder = descendingOrder ? moviesFiltres.reverse() : moviesFiltres;

  debugger;

  const onChangeOrder = (event) => {
    setDescendingOrder(!descendingOrder);
  };

  useEffect(() => {
    (async () => {
      await handleMovieFetch();
    })();
  }, []);

  return (
    <section className="movie-library">
      <h1 className="movie-library__title">Movie Library</h1>

      <img src={wallpaper} alt="Wallpaper" className="movie-library__wallpaper" />

      <SearchBar
        onChangeOrder={onChangeOrder}
        descending={descendingOrder}
        genre={genre}
        genres={genres}
        onChangeGenre={onChangeGenre}
      />

      {loading ? (
        <Loading fetchCount={fetchCount} />
      ) : (
        <ul className="movie-library__list">
          {movieOrder.map((movie) => (
            <Movie {...movie} key={nanoid()} />
          ))}
        </ul>
      )}
    </section>
  );
}
