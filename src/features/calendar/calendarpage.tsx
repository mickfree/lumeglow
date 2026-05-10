import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useCalendar } from "../../common/context/CalendarContext";
import CalendarIcon from "../../components/ui/icons/CalendarIcon";


const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function CalendarPage() {
  const { calendarMovies } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Get movies for the current month/year
  const moviesInView = useMemo(() => {
    return calendarMovies.filter(movie => {
      const d = new Date(movie.calendarDate);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month;
    });
  }, [calendarMovies, year, month]);

  // Create grid days
  const calendarDays = useMemo(() => {
    const days = [];
    // Padding for first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  return (
    <div className="p-6 h-full flex flex-col bg-[#050505] text-white overflow-hidden">
      <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Mi Calendario</h1>
          <p className="text-zinc-500 text-xs md:text-sm font-medium">Gestiona tus próximos estrenos.</p>
        </div>

        <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            title="Mes Anterior"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="px-2 md:px-4 font-bold text-sm md:text-lg min-w-[120px] md:min-w-[150px] text-center shrink-0">
            {MONTHS[month]} {year}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            title="Mes Siguiente"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="w-px h-6 bg-zinc-800 mx-1 shrink-0"></div>
          <button
            onClick={goToToday}
            className="px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 shrink-0"
          >
            Hoy
          </button>
        </div>
      </header>

      <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="py-3 text-center text-xs font-black uppercase tracking-widest text-zinc-500">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
          {calendarDays.map((day, index) => {
            const moviesForDay = day ? moviesInView.filter(m => {
              const d = new Date(m.calendarDate);
              return d.getUTCDate() === day;
            }) : [];
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`min-h-[90px] md:min-h-[120px] p-1.5 md:p-2 border-r border-b border-zinc-800/50 flex flex-col gap-1 transition-colors ${day ? "bg-transparent" : "bg-zinc-950/50"
                  } ${isToday ? "bg-emerald-500/5" : ""}`}
              >
                {day && (
                  <>
                    <span className={`text-xs md:text-sm font-bold mb-1 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full ${isToday ? "bg-emerald-500 text-white" : "text-zinc-600"
                      }`}>
                      {day}
                    </span>
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-full">
                      {moviesForDay.map(movie => (
                        <Link
                          key={movie.id}
                          to={`/movie/${movie.id}`}
                          className="text-[9px] md:text-[10px] bg-zinc-800 border border-zinc-700 p-1 md:p-1.5 rounded-md md:rounded-lg hover:border-emerald-500/50 transition-all flex items-center gap-1 md:gap-2 group"
                        >
                          <div className="hidden sm:block flex-shrink-0 text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                            <CalendarIcon size="12px" />
                          </div>
                          <span className="truncate font-medium group-hover:text-emerald-400">{movie.primaryTitle}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
