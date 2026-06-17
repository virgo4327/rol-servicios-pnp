import { useState, useEffect } from 'react';
import { personal, generarTurnos } from './data/turnos';
import type { Persona } from './data/turnos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from './components/Calendar';
import PersonCard from './components/PersonCard';

const FECHA_ACTUAL = new Date();
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/13vE-Q3vFIrCVDyFybCkDQVux-dCERxhrQrGcB_6C-XM/export?format=csv";
const GOOGLE_SHEETS_EDIT_URL = "https://docs.google.com/spreadsheets/d/13vE-Q3vFIrCVDyFybCkDQVux-dCERxhrQrGcB_6C-XM/edit?usp=sharing";

interface PersonalStatus extends Persona {
  tuvoCaso: boolean;
  estado: 'Activo' | 'Vacaciones';
  fechaUltimoCaso: string;
  esSiguiente: boolean;
}

function App() {
  const turnos = generarTurnos();
  
  // Iniciar en el mes actual
  const [currentDate, setCurrentDate] = useState(new Date(FECHA_ACTUAL.getFullYear(), FECHA_ACTUAL.getMonth(), 1));
  const [personalData, setPersonalData] = useState<PersonalStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Función para descargar y parsear el Google Sheet
  const cargarDatosGoogleSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Agregar timestamp para evitar cache en navegadores
      const respuesta = await fetch(`${GOOGLE_SHEETS_CSV_URL}&t=${new Date().getTime()}`);
      if (!respuesta.ok) throw new Error("No se pudo obtener la información de Google Sheets");
      
      const texto = await respuesta.text();
      const lineas = texto.split(/\r?\n/);
      
      // Encontrar la cabecera
      let indexCabecera = -1;
      for (let i = 0; i < lineas.length; i++) {
        if (lineas[i].toLowerCase().includes("orden,grado,personal")) {
          indexCabecera = i;
          break;
        }
      }
      
      const startIndex = indexCabecera !== -1 ? indexCabecera + 1 : 3;
      const filasParseadas: any[] = [];
      
      for (let i = startIndex; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;
        
        // Regex para separar comas respetando comillas
        const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
        if (columnas.length < 5) continue;
        
        const orden = parseInt(columnas[0], 10);
        if (isNaN(orden)) continue;
        
        const gradoSheet = columnas[1] || '';
        const nombreSheet = columnas[2] || '';
        const tuvoCaso = columnas[3]?.toUpperCase() === 'TRUE';
        const estado = columnas[4]?.toLowerCase() === 'vacaciones' ? 'Vacaciones' : 'Activo';
        const fechaUltimoCaso = columnas[5] || '';
        
        filasParseadas.push({
          orden,
          gradoSheet,
          nombreSheet,
          tuvoCaso,
          estado,
          fechaUltimoCaso
        });
      }
      
      // Combinar con la base local para no perder colores ni campos faltantes
      let listadoCombinado: PersonalStatus[] = filasParseadas
        .filter(row => {
          const localMatch = personal.find(p => p.orden === row.orden);
          return !!localMatch || !!row.nombreSheet.trim();
        })
        .map(row => {
          const localMatch = personal.find(p => p.orden === row.orden);
          const id = localMatch ? localMatch.id : 100 + row.orden;
          const color = localMatch ? localMatch.color : '#64748b';
          
          const grado = row.gradoSheet || localMatch?.grado || 'S3 PNP';
          let nombre = '';
          let apellido = '';
          let apellidoCompleto = '';
          
          if (row.nombreSheet) {
            apellidoCompleto = row.nombreSheet;
            const parts = apellidoCompleto.split(' ');
            apellido = parts[parts.length - 1] || '';
            nombre = parts.slice(0, -1).join(' ') || parts[0];
          } else if (localMatch) {
            nombre = localMatch.nombre;
            apellido = localMatch.apellido;
            apellidoCompleto = localMatch.apellidoCompleto;
          } else {
            nombre = 'Personal';
            apellido = `${row.orden}`;
            apellidoCompleto = `Personal ${row.orden}`;
          }
          
          return {
            id,
            orden: row.orden,
            grado,
            nombre,
            apellido,
            apellidoCompleto,
            color,
            tuvoCaso: row.tuvoCaso,
            estado: row.estado,
            fechaUltimoCaso: row.fechaUltimoCaso,
            esSiguiente: false
          };
        });

      // Ordenar por el número de orden
      listadoCombinado.sort((a, b) => a.orden - b.orden);
      
      // CALCULAR EL SIGUIENTE EN LA RUEDA (CICLO CONTINUO)
      const activos = listadoCombinado.filter(p => p.estado === 'Activo');
      const pendientes = activos.filter(p => !p.tuvoCaso);
      
      let ordenSiguiente = -1;
      if (pendientes.length > 0) {
        // El primero de los activos pendientes
        ordenSiguiente = pendientes[0].orden;
      } else if (activos.length > 0) {
        // Rueda completa: todos los activos ya tuvieron caso. Se reinicia el ciclo.
        ordenSiguiente = activos[0].orden;
      }
      
      // Marcar esSiguiente
      listadoCombinado = listadoCombinado.map(p => ({
        ...p,
        esSiguiente: p.orden === ordenSiguiente
      }));
      
      setPersonalData(listadoCombinado);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar los datos desde Google Sheets. Se mostrarán los datos locales por defecto.");
      
      // Fallback a los datos locales
      const fallbackData: PersonalStatus[] = personal.map((p, idx) => ({
        ...p,
        tuvoCaso: false,
        estado: 'Activo',
        fechaUltimoCaso: '',
        esSiguiente: idx === 0 // Por defecto el primero
      }));
      setPersonalData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Navegar al mes actual al cargar e iniciar descarga
  useEffect(() => {
    setCurrentDate(new Date(FECHA_ACTUAL.getFullYear(), FECHA_ACTUAL.getMonth(), 1));
    cargarDatosGoogleSheets();
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
  
  // Buscar al policía que le toca el siguiente caso para mostrarlo en el banner lateral
  const proximoPolicia = personalData.find(p => p.esSiguiente);

  return (
    <div className="min-h-screen bg-pnp-dark p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2 md:gap-3">
            🚔 ROL DE SERVICIO POLICIAL PNP
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
            <button 
              onClick={handlePrevMonth}
              disabled={currentYear === 2026 && currentMonth === 0}
              className="bg-pnp-medium hover:bg-slate-700 disabled:opacity-30 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all cursor-pointer font-semibold border border-pnp-border"
            >
              ← Ant.
            </button>
            <p className="text-slate-300 text-base sm:text-xl font-bold min-w-[140px] sm:min-w-[200px]">
              {format(currentDate, 'MMMM yyyy', { locale: es }).toUpperCase()}
            </p>
            <button 
              onClick={handleNextMonth}
              disabled={currentYear === 2026 && currentMonth === 11}
              className="bg-pnp-medium hover:bg-slate-700 disabled:opacity-30 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all cursor-pointer font-semibold border border-pnp-border"
            >
              Sig. →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Barra Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-pnp-medium p-4 sm:p-6 rounded-xl border border-pnp-border lg:sticky lg:top-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  👮 Personal y Casos
                </h2>
                <button
                  onClick={cargarDatosGoogleSheets}
                  disabled={loading}
                  title="Actualizar datos desde Google Sheets"
                  className="bg-pnp-light hover:bg-pnp-border text-white p-2 rounded-lg transition-colors border border-pnp-border flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  🔄
                </button>
              </div>

              {/* Banner Destacado del Siguiente Caso */}
              {proximoPolicia && (
                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-2 border-amber-400/80 p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 opacity-10 text-6xl">🎯</div>
                  <p className="text-[11px] sm:text-xs text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    🎯 PRÓXIMO CASO A ATENDER
                  </p>
                  <p className="text-base sm:text-lg font-bold text-white mt-1">
                    {proximoPolicia.grado} {proximoPolicia.apellidoCompleto}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold">Cargando desde Google Sheets...</span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs p-3 rounded-lg">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-1">
                    {personalData.map(p => (
                      <PersonCard 
                        key={p.id} 
                        persona={p}
                        tuvoCaso={p.tuvoCaso}
                        estado={p.estado}
                        esSiguiente={p.esSiguiente}
                        fechaUltimoCaso={p.fechaUltimoCaso}
                      />
                    ))}
                  </div>

                  <div className="pt-2 border-t border-pnp-border/40">
                    <a 
                      href={GOOGLE_SHEETS_EDIT_URL}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500 text-sm"
                    >
                      📊 Editar en Google Sheets
                    </a>
                    <p className="text-[10px] text-slate-400 text-center mt-2 italic">
                      Marca "¿Tuvo Caso?" o cambia el "Estado" en el Sheet, luego haz clic en el botón 🔄 de arriba para actualizar.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Calendario (Intacto) */}
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

