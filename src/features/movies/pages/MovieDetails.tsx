import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCalendar } from "../../../common/hooks/useCalendar";
import { useAuth } from "../../../common/hooks/useAuth";

import type { ImdbReleaseDateInfo, ImdbTitle } from "../../../apis/imdb/types/imdbTypes";
import { getReleaseDates, getTitleById } from "../../../apis/imdb/services/imdbService";

import { MoviePoster } from "../components/MoviePoster";
import { MovieHeader } from "../components/MovieHeader";
import { MovieCast } from "../components/MovieCast";
import { MovieMetadata } from "../components/MovieMetadata";

import CalendarIcon from "../../../components/ui/icons/CalendarIcon";
import ArrowLeftIcon from "../../../components/ui/icons/ArrowLeftIcon";

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<ImdbTitle | null>(null);
  const [releaseDates, setReleaseDates] = useState<ImdbReleaseDateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCalendar, removeFromCalendar, isMovieInCalendar } = useCalendar();
  const { user } = useAuth();

  // carga la informacion de la pelicula
  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      const [movieData, datesData] = await Promise.all([
        getTitleById(id),
        getReleaseDates(id)
      ]);
      setMovie(movieData);
      setReleaseDates(datesData);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleCalendarToggle = async () => {
    if (!movie) return;

    // redireccionar el usuario si no esta autenticado
    if (!user) {
      navigate("/login");
      return;
    }

    if (isMovieInCalendar(movie.id)) {
      await removeFromCalendar(movie.id);
    } else {
      // Usar la primera fecha de lanzamiento si esta disponible, si no, la fecha actual
      const defaultDate = releaseDates.length > 0
        ? new Date(releaseDates[0].releaseDate.year, releaseDates[0].releaseDate.month - 1, releaseDates[0].releaseDate.day).toISOString()
        : new Date().toISOString();
      await addToCalendar(movie, defaultDate);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#050505] text-white">
        <h2 className="text-2xl font-bold mb-4">Película no encontrada</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const inCalendar = isMovieInCalendar(movie.id);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeftIcon size="20px" className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {inCalendar && (
            <button
              onClick={() => navigate("/calendar")}
              className="flex-1 md:flex-none flex items-center justify-center px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-md border border-emerald-500/30 text-xs md:text-sm font-medium text-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <CalendarIcon size="18px" className="mr-2" />
              Ver calendario
            </button>
          )}

          {/* condicional de contenido */}
          <button
            onClick={handleCalendarToggle}
            className={`flex-1 md:flex-none flex items-center justify-center px-6 py-1.5 rounded-md font-bold transition-all text-xs md:text-sm ${inCalendar
              ? "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
              : "bg-emerald-600 border border-zinc-800 hover:bg-emerald-500"
              }`}
          >
            <CalendarIcon size="20px" className="mr-2" />
            {inCalendar ? "Quitar" : "Añadir"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <MoviePoster movie={movie} />

        {/* Right Column: Info */}
        <div className="lg:col-span-2 space-y-5">
          <MovieHeader movie={movie} releaseDates={releaseDates} />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              Sinopsis
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
              {movie.plot || "No hay una descripción disponible para esta película."}
            </p>
          </section>

          <MovieCast movie={movie} />

          <MovieMetadata movie={movie} />
        </div>
      </div>
    </div>
  );
}