import type { ImdbTitle } from "../../../apis/imdb/types/imdbTypes";
import ImdbStarIcon from "../../../components/ui/icons/ImdbStarIcon";

interface MoviePosterProps {
  movie: ImdbTitle;
}

export function MoviePoster({ movie }: MoviePosterProps) {
  return (
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
  );
}
