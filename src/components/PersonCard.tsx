import type { Persona } from '../data/turnos';

interface PersonCardProps {
  persona: Persona;
}

export default function PersonCard({ persona }: PersonCardProps) {
  return (
    <div className="bg-pnp-light p-2.5 sm:p-4 rounded-lg border border-pnp-border hover:bg-pnp-border transition-colors">
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full shadow-lg flex-shrink-0"
          style={{ backgroundColor: persona.color }}
        ></div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-white truncate">{persona.apellido}</h3>
          <p className="text-[10px] sm:text-xs text-slate-400">{persona.grado}</p>
        </div>
      </div>
    </div>
  );
}
