import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getTitleById, getReleaseDates, type ImdbTitle, type ImdbReleaseDateInfo } from "../../../apis/imdb/services/imdbService";
import { useCalendar } from "../../../common/hooks/useCalendar";
import { useAuth } from "../../../common/hooks/useAuth";
import CalendarIcon from "../../../components/ui/icons/CalendarIcon";
import ImdbStarIcon from "../../../components/ui/icons/ImdbStarIcon";
import TimeIcon from "../../../components/ui/icons/TimeIcon";
import ArrowLeftIcon from "../../../components/ui/icons/ArrowLeftIcon";

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<ImdbTitle | null>(null);
  const [releaseDates, setReleaseDates] = useState<ImdbReleaseDateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCalendar, removeFromCalendar, isMovieInCalendar } = useCalendar();
  const { user } = useAuth();

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

    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    if (isMovieInCalendar(movie.id)) {
      await removeFromCalendar(movie.id);
    } else {
      // Use the first release date if available, otherwise today
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
        {/* Left Column: Poster */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center">
            {movie.primaryImage ? (
              <img
                src={movie.primaryImage.url}
                alt={movie.primaryTitle}
                className="w-2/3 rounded-2xl shadow-2xl border border-zinc-800"
              />
            ) : (
              <div className="w-2/3 aspect-[2/3] bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                <span className="text-zinc-600">Sin Imagen</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between">
            {movie.rating && (
              <div className="mt-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">IMDB Rating</p>
                  <div className="flex items-center">
                    <ImdbStarIcon size="20px" className="mr-2 text-yellow-500" />
                    <span className="text-lg font-bold">{movie.rating.aggregateRating}</span>
                    <span className="text-zinc-500 ml-2">/ 10</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Votos</p>
                  <p className="text-sm font-semibold">{movie.rating.voteCount.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-2 space-y-5">
          <header>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full border border-zinc-200">
                {movie.type}
              </span>
              |
              {movie.genres?.map(genre => (
                <span key={genre} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                  {genre}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 hover:text-emerald-400 transition-colors cursor-pointer">{movie.primaryTitle}</h1>
            <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-medium mb-2">
              <span className="flex items-center">
                <CalendarIcon size="20px" className="mr-2" />
                {movie.startYear}
              </span>
              {movie.runtimeSeconds && (
                <span className="flex items-center">
                  <TimeIcon size="20px" className="mr-2" />
                  {Math.floor(movie.runtimeSeconds / 3600)}h {Math.floor((movie.runtimeSeconds % 3600) / 60)}m
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-2xl text-zinc-400 font-medium">
              <h2 className="text-xl font-bold text-zinc-100">Fecha de Estreno:</h2>
              <p className="text-xl font-bold text-zinc-100">
                {(() => {
                  const counts = new Map<string, number>();
                  releaseDates.forEach(rd => {
                    const dateStr = `${rd.releaseDate.day}/${rd.releaseDate.month}/${rd.releaseDate.year}`;
                    counts.set(dateStr, (counts.get(dateStr) || 0) + 1);
                  });
                  let mostFrequent = "";
                  let maxCount = 0;
                  counts.forEach((count, date) => {
                    if (count > maxCount) {
                      maxCount = count;
                      mostFrequent = date;
                    }
                  });
                  return mostFrequent;
                })()}
              </p>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              Sinopsis
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
              {movie.plot || "No hay una descripción disponible para esta película."}
            </p>
          </section>

          {/* Cast & Crew Tabs/Sections */}
          <div className="space-y-6">
            {movie.directors && movie.directors.length > 0 && (
              <section>
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-2">Directores</h3>
                <div className="flex flex-wrap gap-6">
                  {movie.directors.map(person => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            )}

            {movie.writers && movie.writers.length > 0 && (
              <section>
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-2">Escritores</h3>
                <div className="flex flex-wrap gap-6">
                  {movie.writers.map(person => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            )}

            {movie.stars && movie.stars.length > 0 && (
              <section>
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-2">Reparto Principal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movie.stars.map(person => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-900">
            {movie.originCountries && movie.originCountries.length > 0 && (
              <div>
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-4">Países de Origen</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.originCountries.map(c => (
                    <span key={c.code} className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-sm">{c.name}</span>
                  ))}
                </div>
              </div>
            )}
            {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
              <div>
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-4">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.spokenLanguages.map(l => (
                    <span key={l.code} className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-sm">{l.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: any }) {
  return (
    <div className="relative group flex flex-col space-y-0.5 bg-zinc-900/10 p-2 cursor-default border border-transparent hover:border-zinc-800 rounded-lg transition-colors">
      <span className="text-sm font-medium text-zinc-100 group-hover:text-emerald-400 transition-colors">
        {person.displayName}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
        {person.primaryProfessions?.[0] || 'Actor'}
      </span>

      {/* Hover Image Tooltip */}
      {person.primaryImage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 aspect-[2/3] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-zinc-700">
            <img
              src={person.primaryImage.url}
              alt={person.displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-zinc-700"></div>
        </div>
      )}
    </div>
  );
}