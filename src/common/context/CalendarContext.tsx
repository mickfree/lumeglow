import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { ImdbTitle } from "../../apis/imdb/imdbApi";
import { supabase } from "../../apis/supabase/supabase";
import { useAuth } from "../hooks/useAuth";

interface CalendarMovie extends ImdbTitle {
  calendarDate: string; // ISO date string
}

interface CalendarContextType {
  calendarMovies: CalendarMovie[];
  addToCalendar: (movie: ImdbTitle, date: string) => Promise<void>;
  removeFromCalendar: (movieId: string) => Promise<void>;
  isMovieInCalendar: (movieId: string) => boolean;
  loading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendarMovies, setCalendarMovies] = useState<CalendarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load from Supabase on mount or when user changes
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
          // Placeholder values for other required ImdbTitle fields if any
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

    // Standardize to YYYY-MM-DD to avoid timezone shifts
    const cleanDate = date.includes("T") ? date.split("T")[0] : date;

    if (!isMovieInCalendar(movie.id)) {
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

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
