import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { Sidebar } from "../sidebar/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { searchTitles, type ImdbTitle } from "../../apis/imdb/imdbApi";
import SearchIcon from "../../components/ui/icons/SearchIcon";
import ArrowDownIcon from "../../components/ui/icons/ArrowDownIcon";
import ImdbStarIcon from "../../components/ui/icons/ImdbStarIcon";
import MenuIcon from "../../components/ui/icons/MenuIcon";


export function Layout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ImdbTitle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Resetear el scroll al cambiar de ruta
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        const results = await searchTitles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen text-zinc-300 font-sans bg-[#050505]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64 h-screen w-full">
        {/* Top Header with Search and Dropdown */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <MenuIcon size="24px" />
            </button>
            <div className="relative w-full max-w-md" ref={searchContainerRef}>
            <div className="flex items-center text-zinc-500 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 focus-within:border-zinc-600 transition-colors">
              <SearchIcon size="16px" className="mr-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar películas o series..."
                className="bg-transparent border-none outline-none text-zinc-300 placeholder-zinc-600 w-full text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 3 && setShowSearchResults(true)}
              />
              {isSearching && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute md:absolute top-full left-0 right-0 md:left-0 md:right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-md:fixed max-md:top-[70px] max-md:left-4 max-md:right-4 max-md:w-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center px-4 md:px-5 py-3.5 hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                          {movie.primaryImage ? (
                            <img src={movie.primaryImage.url} alt={movie.primaryTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">?</div>
                          )}
                        </div>
                        <div className="ml-4 overflow-hidden">
                          <p className="text-sm font-bold text-zinc-200 group-hover:text-white truncate">{movie.primaryTitle}</p>
                          <p className="text-xs text-zinc-500">{movie.startYear} • {movie.type === 'movie' ? 'Película' : 'Serie'}</p>
                        </div>
                        {movie.rating && (
                          <div className="ml-auto flex items-center text-xs font-bold text-yellow-500">
                            <ImdbStarIcon size="12px" className="mr-1" />
                            {movie.rating.aggregateRating}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-zinc-500 text-sm italic">
                    No se encontraron resultados para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors border border-transparent active:border-zinc-700"
            >
              <div className="px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-sm">
                {user?.email?.charAt(0) || "U"}
              </div>
              <span className="hidden md:inline px-3 py-1 bg-zinc-900 rounded-md border border-zinc-800 text-sm">
                {user?.email ? `@${user.email.split('@')[0]}` : "User"}
              </span>
              <ArrowDownIcon size="16px" className="ml-2 text-zinc-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-1.5 z-20">
                <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                  <p className="text-xs text-zinc-500">Usuario</p>
                  <p className="text-sm font-medium truncate">{user?.email || "usuario@ejemplo.com"}</p>
                </div>
                {/* <button className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors">
                  Perfil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors">
                  Configuración
                </button> */}
                {/* <div className="h-px bg-zinc-800 my-1"></div> */}
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto relative">
          <div className="max-w-auto mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}