import { useState, useEffect } from 'react';
import { personal, generarTurnos } from './data/turnos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from './components/Calendar';
import PersonCard from './components/PersonCard';

const FECHA_ACTUAL = new Date();

function App() {
  const turnos = generarTurnos();
  
  // Iniciar en el mes actual
  const [currentDate, setCurrentDate] = useState(new Date(FECHA_ACTUAL.getFullYear(), FECHA_ACTUAL.getMonth(), 1));
   
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navegar al mes actual al cargar
  useEffect(() => {
    setCurrentDate(new Date(FECHA_ACTUAL.getFullYear(), FECHA_ACTUAL.getMonth(), 1));
  }, []);

  const handlePrevMonth = () => {
    if (currentYear === 2026 && currentMonth > 0) {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (currentYear === 2026 && currentMonth < 11) {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-pnp-medium p-6 rounded-xl border border-pnp-border sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                👮 Personal
              </h2>
              <div className="space-y-3">
                {personal.map(p => (
                  <PersonCard key={p.id} persona={p} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Calendar
              year={currentYear}
              month={currentMonth}
              turnos={turnos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
