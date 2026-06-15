import { format, getDaysInMonth, startOfMonth, getDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Turno } from '../data/turnos';

interface CalendarProps {
  year: number;
  month: number;
  turnos: Turno[];
}

export default function Calendar({ year, month, turnos }: CalendarProps) {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const startDay = getDay(firstDayOfMonth);
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  
  const monthName = format(new Date(year, month), 'MMMM yyyy', { locale: es }).toUpperCase();
  
  const turnosDelMes = turnos.filter(t => 
    t.fecha.getMonth() === month && t.fecha.getFullYear() === year
  );
  
  const getTurnoForDay = (day: number) => {
    return turnosDelMes.find(t => t.fecha.getDate() === day);
  };
  
  const days = [];
  
  for (let i = 0; i < adjustedStartDay; i++) {
    days.push(<div key={'empty-' + i} className="aspect-square"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const turno = getTurnoForDay(day);
    const hasTurno = !!turno;
    const currentDate = new Date(year, month, day);
    const isCurrentDay = isToday(currentDate);
    
    let dayClasses = 'aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ';
    
    if (isCurrentDay) {
      dayClasses += 'bg-yellow-600 border-yellow-400 ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/50 ';
    } else if (hasTurno) {
      dayClasses += 'bg-slate-700 border-slate-600 ';
    } else {
      dayClasses += 'bg-slate-800/50 border-slate-700 text-slate-500 ';
    }
    
    days.push(
      <div
        key={day}
        className={dayClasses}
      >
        <span className={'text-sm sm:text-base md:text-lg ' + (isCurrentDay ? 'font-bold text-white' : '')}>{day}</span>
        {hasTurno && turno && (
          <div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full mt-0.5 sm:mt-1 shadow-md"
            style={{ backgroundColor: turno.persona.color }}
          ></div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 p-3 sm:p-6 rounded-xl border border-slate-700">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">{monthName}</h3>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center text-xs sm:text-sm font-semibold text-slate-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days}
      </div>
    </div>
  );
}
