import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Turno } from '../data/turnos';

interface CalendarProps {
  year: number;
  month: number;
  turnos: Turno[];
  onDayClick: (turno: Turno | null) => void;
}

export default function Calendar({ year, month, turnos, onDayClick }: CalendarProps) {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const startDay = getDay(firstDayOfMonth);
  
  const monthName = format(new Date(year, month), 'MMMM yyyy', { locale: es }).toUpperCase();
  
  const turnosDelMes = turnos.filter(t => 
    t.fecha.getMonth() === month && t.fecha.getFullYear() === year
  );
  
  const getTurnoForDay = (day: number) => {
    return turnosDelMes.find(t => t.fecha.getDate() === day);
  };
  
  const handleDayClick = (turno: Turno | null) => {
    if (turno) {
      onDayClick(turno);
    }
  };
  
  const days = [];
  
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={'empty-' + i} className="aspect-square"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const turno = getTurnoForDay(day);
    const hasTurno = !!turno;
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(turno || null)}
        disabled={!hasTurno}
        className={'aspect-square flex flex-col items-center justify-center rounded-lg border ' + (hasTurno ? 'bg-slate-700 border-slate-600 cursor-pointer hover:bg-slate-600 hover:scale-105 transition-all' : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed')}
      >
        <span className="text-lg">{day}</span>
        {hasTurno && turno && (
          <div
            className="w-3 h-3 rounded-full mt-1 shadow-md"
            style={{ backgroundColor: turno.persona.color }}
          ></div>
        )}
      </button>
    );
  }
  
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 text-center">{monthName}</h3>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center text-sm font-semibold text-slate-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}
