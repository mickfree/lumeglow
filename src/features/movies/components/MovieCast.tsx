import type { ImdbTitle } from "../../../apis/imdb/types/imdbTypes";
import { PersonCard } from "./PersonCard";

interface MovieCastProps {
  movie: ImdbTitle;
}

export function MovieCast({ movie }: MovieCastProps) {
  return (
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
  );
}
