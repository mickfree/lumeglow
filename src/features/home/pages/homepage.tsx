import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getTitles } from "../../../apis/imdb/services/imdbService";
import type { ImdbTitle } from "../../../apis/imdb/types/imdbTypes";

import CalendarIcon from "../../../components/ui/icons/CalendarIcon";
import ImdbStarIcon from "../../../components/ui/icons/ImdbStarIcon";

// muestra las peliculas destacadas
export function HomePage() {
  const [movies, setMovies] = useState<ImdbTitle[]>([]);
  const [loading, setLoading] = useState(true);

  // carga la informacion de las peliculas
  useEffect(() => {
    async function fetchMovies() {
      const data = await getTitles();
      setMovies(data);
      setLoading(false);
    }
    fetchMovies();
  }, []);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto bg-[#050505] text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Películas Destacadas</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 flex flex-col cursor-pointer border border-zinc-800"
            >
              {movie.primaryImage ? (
                <img
                  src={movie.primaryImage.url}
                  alt={movie.primaryTitle}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-500">Sin Imagen</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-1 line-clamp-1" title={movie.primaryTitle}>
                  {movie.primaryTitle}
                </h2>

                <div className="flex items-center text-sm text-zinc-400 mb-3 space-x-2">
                  <span className="flex items-center">
                    <CalendarIcon size="16px" className="mr-1 text-zinc-500" />
                    {movie.startYear}
                  </span>
                  {movie.rating && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <ImdbStarIcon size="16px" className="mr-1 text-yellow-500" />
                        {movie.rating.aggregateRating}
                      </span>
                    </>
                  )}
                  <span className="ml-auto uppercase text-xs font-semibold bg-zinc-800 px-2 py-0.5 rounded">{movie.type === 'movie' ? 'Película' : 'Serie'}</span>
                </div>

                {movie.genres && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres.slice(0, 3).map(genre => (
                      <span key={genre} className="px-2 py-1 bg-zinc-800 text-xs rounded-full text-zinc-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-zinc-400 line-clamp-3 mt-auto">
                  {movie.plot || "Sin descripción disponible."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}