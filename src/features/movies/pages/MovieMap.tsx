import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getTitlesByCountry, type ImdbTitle } from '../../../apis/imdb/services/imdbService';

// Fix for default marker icons in Leaflet with Vite/Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CountryLocation {
  code: string;
  name: string;
  query: string;
  coords: [number, number];
}

const COUNTRIES: CountryLocation[] = [
  { code: 'AR', name: 'Argentina', query: 'Argentina', coords: [-38.4161, -63.6167] },
  { code: 'BO', name: 'Bolivia', query: 'Bolivia', coords: [-16.2902, -63.5887] },
  { code: 'BR', name: 'Brasil', query: 'Brazil', coords: [-14.235, -51.9253] },
  { code: 'CA', name: 'Canadá', query: 'Canada', coords: [56.1304, -106.3468] },
  { code: 'CL', name: 'Chile', query: 'Chile', coords: [-35.6751, -71.543] },
  { code: 'CO', name: 'Colombia', query: 'Colombia', coords: [4.5709, -74.2973] },
  { code: 'CR', name: 'Costa Rica', query: 'Costa Rica', coords: [9.7489, -83.7534] },
  { code: 'CU', name: 'Cuba', query: 'Cuba', coords: [21.5218, -77.7812] },
  { code: 'DM', name: 'Dominica', query: 'Dominica', coords: [15.415, -61.371] },
  { code: 'EC', name: 'Ecuador', query: 'Ecuador', coords: [-1.8312, -78.1834] },
  { code: 'SV', name: 'El Salvador', query: 'El Salvador', coords: [13.7942, -88.8965] },
  { code: 'US', name: 'EE.UU.', query: 'USA', coords: [37.0902, -95.7129] },
  { code: 'GT', name: 'Guatemala', query: 'Guatemala', coords: [15.7835, -90.2308] },
  { code: 'HN', name: 'Honduras', query: 'Honduras', coords: [15.1999, -86.2419] },
  { code: 'MX', name: 'México', query: 'Mexico', coords: [23.6345, -102.5528] },
  { code: 'NI', name: 'Nicaragua', query: 'Nicaragua', coords: [12.8654, -85.2072] },
  { code: 'PA', name: 'Panamá', query: 'Panama', coords: [8.538, -80.7821] },
  { code: 'PY', name: 'Paraguay', query: 'Paraguay', coords: [-23.4425, -58.4438] },
  { code: 'PE', name: 'Perú', query: 'Peru', coords: [-9.19, -75.0152] },
  { code: 'DO', name: 'República Dominicana', query: 'Dominican Republic', coords: [18.7357, -70.1627] },
  { code: 'UY', name: 'Uruguay', query: 'Uruguay', coords: [-32.5228, -55.7658] },
  { code: 'VE', name: 'Venezuela', query: 'Venezuela', coords: [6.4238, -66.5897] },
  { code: 'GB', name: 'Reino Unido', query: 'UK', coords: [55.3781, -3.436] },
  { code: 'JP', name: 'Japón', query: 'Japan', coords: [36.2048, 138.2529] },
  { code: 'FR', name: 'Francia', query: 'France', coords: [46.2276, 2.2137] },
  { code: 'ES', name: 'España', query: 'Spain', coords: [40.4637, -3.7492] },
  { code: 'KR', name: 'Corea del Sur', query: 'South Korea', coords: [35.9078, 127.7669] },
  { code: 'IN', name: 'India', query: 'India', coords: [20.5937, 78.9629] },
];


export function MovieMap() {
  const [activeCountry, setActiveCountry] = useState<CountryLocation | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<ImdbTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeCountry) {
      const fetchMoviesForCountry = async () => {
        setIsLoading(true);
        console.log("Searching movies for:", activeCountry.query);
        const movies = await getTitlesByCountry(activeCountry.query);
        console.log("Results for", activeCountry.query, ":", movies);
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

      {/* Side Panel for Details */}
      <div className={`
        fixed md:relative inset-0 md:inset-auto md:w-120 bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col transition-all duration-500 ease-in-out z-[2000] md:z-10
        ${activeCountry ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                            ★ {movie.rating.aggregateRating}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="italic text-sm">Selecciona un país en el mapa para explorar su cine.</p>
          </div>
        )}
      </div>
    </div>
  );
}
