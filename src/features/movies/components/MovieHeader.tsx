import type { ImdbTitle, ImdbReleaseDateInfo } from "../../../apis/imdb/types/imdbTypes";
import CalendarIcon from "../../../components/ui/icons/CalendarIcon";
import TimeIcon from "../../../components/ui/icons/TimeIcon";

interface MovieHeaderProps {
  movie: ImdbTitle;
  releaseDates: ImdbReleaseDateInfo[];
}

export function MovieHeader({ movie, releaseDates }: MovieHeaderProps) {
  // Helper to find the most frequent release date
  const mainReleaseDate = (() => {
    if (releaseDates.length === 0) return "N/A";
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
  })();

  return (
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
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 hover:text-emerald-400 transition-colors cursor-pointer">
        {movie.primaryTitle}
      </h1>
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
        <p className="text-xl font-bold text-zinc-100">{mainReleaseDate}</p>
      </div>
    </header>
  );
}
