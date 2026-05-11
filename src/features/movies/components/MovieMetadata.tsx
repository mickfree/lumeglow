import type { ImdbTitle } from "../../../apis/imdb/types/imdbTypes";

interface MovieMetadataProps {
  movie: ImdbTitle;
}

export function MovieMetadata({ movie }: MovieMetadataProps) {
  return (
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
  );
}
