import type { Persona } from '../data/turnos';

interface PersonCardProps {
  persona: Persona;
}

export default function PersonCard({ persona }: PersonCardProps) {
  return (
    <div className="bg-pnp-light p-4 rounded-lg border border-pnp-border hover:bg-pnp-border transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full shadow-lg"
          style={{ backgroundColor: persona.color }}
        ></div>
        <div>
          <h3 className="font-semibold text-white">{persona.apellido}</h3>
          <p className="text-xs text-slate-400">{persona.grado}</p>
        </div>
      </div>
    </div>
  );
}
