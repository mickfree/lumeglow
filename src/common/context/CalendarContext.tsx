import { createContext, useState, useEffect, type ReactNode } from "react";
import type { ImdbTitle } from "../../apis/imdb/services/imdbService";
import { supabase } from "../../apis/supabase/supabase";
import { useAuth } from "../hooks/useAuth";

//Interfaz para manejar el calendario de peliculas
interface CalendarMovie extends ImdbTitle {
  calendarDate: string;
}

//Interfaz para manejar el contexto del calendario
interface CalendarContextType {
  calendarMovies: CalendarMovie[];
  addToCalendar: (movie: ImdbTitle, date: string) => Promise<void>;
  removeFromCalendar: (movieId: string) => Promise<void>;
  isMovieInCalendar: (movieId: string) => boolean;
  loading: boolean;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendarMovies, setCalendarMovies] = useState<CalendarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Obtenemos el usuario actual

  // Carga desde Supabase al montar o cuando cambia el usuario
  useEffect(() => {
    const fetchCalendar = async () => {
      if (!user) {
        setCalendarMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("user_calendar")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching calendar:", error);
      } else if (data) {
        const mappedMovies: CalendarMovie[] = data.map((item) => ({
          id: item.movie_id,
          primaryTitle: item.title,
          calendarDate: item.calendar_date,
          primaryImage: item.poster_url ? { url: item.poster_url, width: 0, height: 0 } : undefined,
          // Valores de marcador de posición para otros campos ImdbTitle requeridos
          type: "movie",
          originalTitle: item.title,
        }));
        setCalendarMovies(mappedMovies);
      }
      setLoading(false);
    };

    fetchCalendar();
  }, [user]);

  const addToCalendar = async (movie: ImdbTitle, date: string) => {
    if (!user) return;

    // Estandarizamos a YYYY-MM-DD para evitar desplazamientos de zona horaria
    const cleanDate = date.includes("T") ? date.split("T")[0] : date;

    if (!isMovieInCalendar(movie.id)) { // Verificamos si la película ya está en el calendario
      const { error } = await supabase.from("user_calendar").insert({
        user_id: user.id,
        movie_id: movie.id,
        calendar_date: cleanDate,
        title: movie.primaryTitle,
        poster_url: movie.primaryImage?.url || null,
      });

      if (error) {
        console.error("Error adding to calendar:", error);
        return;
      }

      setCalendarMovies((prev) => [...prev, { ...movie, calendarDate: cleanDate }]);
    }
  };

  const removeFromCalendar = async (movieId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_calendar")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

    if (error) {
      console.error("Error removing from calendar:", error);
      return;
    }

    setCalendarMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isMovieInCalendar = (movieId: string) => {
    return calendarMovies.some((m) => m.id === movieId);
  };

  return (
    <CalendarContext.Provider
      value={{ calendarMovies, addToCalendar, removeFromCalendar, isMovieInCalendar, loading }}
    >
      {children}
    </CalendarContext.Provider>
  );
}


