import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";

// Hook para usar el contexto del calendario
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
