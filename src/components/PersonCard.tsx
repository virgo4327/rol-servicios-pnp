import type { Persona } from '../data/turnos';

interface PersonCardProps {
  persona: Persona;
  tuvoCaso?: boolean;
  estado?: 'Activo' | 'Vacaciones';
  esSiguiente?: boolean;
  fechaUltimoCaso?: string;
}

export default function PersonCard({ 
  persona, 
  tuvoCaso = false, 
  estado = 'Activo', 
  esSiguiente = false,
  fechaUltimoCaso = ''
}: PersonCardProps) {
  const esVacaciones = estado === 'Vacaciones';

  return (
    <div 
      className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
        esSiguiente 
          ? 'bg-pnp-light border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] scale-[1.02]' 
          : esVacaciones
            ? 'bg-pnp-medium/40 border-pnp-border/60 opacity-60'
            : tuvoCaso
              ? 'bg-pnp-medium/60 border-pnp-border hover:bg-pnp-light/80'
              : 'bg-pnp-light border-pnp-border hover:bg-pnp-border'
      }`}
    >
      {esSiguiente && (
        <div className="absolute -top-2.5 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md animate-bounce flex items-center gap-1 z-10">
          <span>🎯</span> SIGUIENTE
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-inner flex-shrink-0 bg-slate-500"
          ></div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-white truncate">
              {persona.apellido}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {persona.grado}
            </p>
          </div>
        </div>

        {/* Badges / Estados */}
        <div className="flex flex-wrap items-center gap-1 sm:self-center">
          {esVacaciones ? (
            <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded">
              🌴 Vacaciones
            </span>
          ) : (
            <>
              {tuvoCaso ? (
                <span className="bg-slate-700 text-slate-300 border border-slate-600 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  🔘 Tuvo Caso
                </span>
              ) : (
                <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded animate-pulse">
                  🔵 Pendiente
                </span>
              )}
            </>
          )}
        </div>
      </div>
      
      {fechaUltimoCaso && (
        <div className="mt-2 pt-1.5 border-t border-pnp-border/40 text-[9px] sm:text-[10px] text-slate-400">
          Último caso: <span className="text-slate-300 font-semibold">{fechaUltimoCaso}</span>
        </div>
      )}
    </div>
  );
}

