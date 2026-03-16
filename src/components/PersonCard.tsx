import type { Persona, Turno } from '../data/turnos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PersonCardProps {
  persona: Persona;
  turnos: Turno[];
}

export default function PersonCard({ persona, turnos }: PersonCardProps) {
  const turnosPersona = turnos.filter(t => t.persona.id === persona.id);
  const proximoTurno = turnosPersona.find(t => t.fecha >= new Date());
  
  return (
    <div className="bg-pnp-light p-4 rounded-lg border border-pnp-border hover:bg-pnp-border transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-5 h-5 rounded-full shadow-lg"
          style={{ backgroundColor: persona.color }}
        ></div>
        <div>
          <h3 className="font-semibold text-white">{persona.apellido}</h3>
          <p className="text-xs text-slate-400">{persona.grado}</p>
        </div>
      </div>
      
      <div className="text-sm space-y-1">
        <p className="text-slate-300">
          <span className="font-medium">Turnos:</span> {turnosPersona.length}
        </p>
        {proximoTurno && (
          <p className="text-slate-300">
            <span className="font-medium">Próximo:</span>{' '}
            {format(proximoTurno.fecha, 'd MMM', { locale: es })}
          </p>
        )}
      </div>
    </div>
  );
}
