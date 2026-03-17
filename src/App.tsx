import { useState } from 'react';
import { personal, generarTurnos } from './data/turnos';
import type { Turno } from './data/turnos';
import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from './components/Calendar';
import PersonCard from './components/PersonCard';
import TurnDetails from './components/TurnDetails';

// PARA PROBAR: Cambia solo los números de esta línea
const FECHA_ACTUAL = new Date(); // Usa fecha real del sistema

function App() {
  const turnos = generarTurnos();
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Inicia en Marzo 2026
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    if (currentYear === 2026 && currentMonth > 0) { // Permitir hasta Enero
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (currentYear === 2026 && currentMonth < 11) { // Permitir hasta Diciembre
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    }
  };
  
  const proximoTurno = turnos.find(t => t.fecha >= FECHA_ACTUAL);
  const diasRestantes = proximoTurno 
    ? differenceInDays(proximoTurno.fecha, FECHA_ACTUAL)
    : null;
  
  const handleDayClick = (turno: Turno | null) => {
    setSelectedTurno(turno);
  };
  
  return (
    <div className="min-h-screen bg-pnp-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🚔 ROL DE SERVICIO POLICIAL PNP
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button 
              onClick={handlePrevMonth}
              disabled={currentYear === 2026 && currentMonth === 0}
              className="bg-pnp-medium hover:bg-slate-700 disabled:opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              ← Anterior
            </button>
            <p className="text-slate-300 text-xl font-semibold min-w-[200px]">
              {format(currentDate, 'MMMM yyyy', { locale: es }).toUpperCase()}
            </p>
            <button 
              onClick={handleNextMonth}
              disabled={currentYear === 2026 && currentMonth === 11}
              className="bg-pnp-medium hover:bg-slate-700 disabled:opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              Siguiente →
            </button>
          </div>
        </div>
        
        {proximoTurno && (
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-xl mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-full shadow-lg"
                  style={{ backgroundColor: proximoTurno.persona.color }}
                ></div>
                <div>
                  <p className="text-sm font-medium text-yellow-100">PRÓXIMO TURNO</p>
                  <p className="text-xl font-bold text-white">
                    {proximoTurno.persona.grado} {proximoTurno.persona.apellido}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-white">
                  {format(proximoTurno.fecha, "d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-sm text-yellow-100">
                  {diasRestantes === 0 ? 'HOY' : `En ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-pnp-medium p-6 rounded-xl border border-pnp-border sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                👮 Personal
              </h2>
              <div className="space-y-3">
                {personal.map(p => (
                  <PersonCard key={p.id} persona={p} turnos={turnos} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {selectedTurno && (
              <TurnDetails turno={selectedTurno} onClose={() => setSelectedTurno(null)} />
            )}
            
            <Calendar
              year={currentYear}
              month={currentMonth}
              turnos={turnos}
              onDayClick={handleDayClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
