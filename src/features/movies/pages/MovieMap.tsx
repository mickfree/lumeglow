import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import L from 'leaflet';

import type { ImdbTitle } from '../../../apis/imdb/types/imdbTypes';
import { getTitlesByCountry } from '../../../apis/imdb/services/imdbService';

import type { CountryLocation } from '../types/countryLocationType';
import { COUNTRIES } from '../constants/countries';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import ImdbStarIcon from '../../../components/ui/icons/ImdbStarIcon';
import CloseIcon from '../../../components/ui/icons/CloseIcon';
import GlobeIcon from '../../../components/ui/icons/GlobeIcon';

// Icono por defecto para los marcadores
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export function MovieMap() {
  const [activeCountry, setActiveCountry] = useState<CountryLocation | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<ImdbTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar peliculas por país
  useEffect(() => {
    if (activeCountry) {
      const fetchMoviesForCountry = async () => {
        setIsLoading(true);
        const movies = await getTitlesByCountry(activeCountry.query);
        setFilteredMovies(movies);
        setIsLoading(false);
      };
      fetchMoviesForCountry();
    } else {
      setFilteredMovies([]);
    }
  }, [activeCountry]);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row bg-[#050505] relative overflow-hidden">
      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {COUNTRIES.map((country) => (
            <Marker
              key={country.code}
              position={country.coords}
              eventHandlers={{
                click: () => setActiveCountry(country),
              }}
            />
          ))}
        </MapContainer>

        {isLoading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Detalles de Peliculas por País */}
      <div className={`
        absolute right-0 top-0 bottom-0 w-full md:w-120 bg-zinc-950/80 backdrop-blur-xl border-l border-zinc-800 p-6 flex flex-col transition-all duration-500 ease-in-out z-[2000]
        ${activeCountry ? 'translate-x-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]' : 'translate-x-full'}
      `}>
        {activeCountry ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeCountry.name}</h2>
                <p className="text-zinc-500 text-sm">Producciones originales</p>
              </div>
              <button
                onClick={() => setActiveCountry(null)}
                className="text-zinc-500 hover:text-white"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Resultados ({filteredMovies.length})
              </h3>

              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <div key={movie.id} className="group border-b border-zinc-900 pb-4">
                    <Link to={`/movie/${movie.id}`} className="flex gap-3">
                      <div className="w-16 h-24 bg-zinc-900 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                        {movie.primaryImage ? (
                          <img src={movie.primaryImage.url} alt={movie.primaryTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700">NO IMG</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">{movie.primaryTitle}</span>
                        <span className="text-[10px] text-zinc-500">{movie.startYear}</span>
                        {movie.rating && (
                          <div className="flex items-center text-[10px] text-yellow-500 mt-1 font-bold">
                            <ImdbStarIcon className="w-3 h-3 mr-1 text-yellow-500" /> {movie.rating.aggregateRating}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-zinc-600 text-sm italic">
                  No hay películas registradas para este país en tu colección actual.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-center space-y-4">
            <GlobeIcon className="w-12 h-12 text-zinc-800" />
            <p className="italic text-sm">Selecciona un país en el mapa para explorar su cine.</p>
          </div>
        )}
      </div>
    </div>
  );
}
