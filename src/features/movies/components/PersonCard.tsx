import type { ImdbPerson } from "../../../apis/imdb/types/imdbTypes";

interface PersonCardProps {
  person: ImdbPerson;
}

export function PersonCard({ person }: PersonCardProps) {
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
