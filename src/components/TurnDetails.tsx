import type { Turno } from '../data/turnos';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';

interface TurnDetailsProps {
  turno: Turno | null;
  onClose: () => void;
}

export default function TurnDetails({ turno, onClose }: TurnDetailsProps) {
  if (!turno) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-pnp-medium p-8 rounded-2xl border-4 border-yellow-500 shadow-2xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-yellow-400">📋 Detalles del Turno</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-pnp-light rounded-lg"
          >
            <X size={28} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-pnp-dark p-4 rounded-xl border border-pnp-border">
            <p className="text-sm text-slate-400 mb-2">📅 Fecha</p>
            <p className="text-2xl font-bold text-white">
              {format(turno.fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
          
          <div className="bg-pnp-dark p-4 rounded-xl border border-pnp-border">
            <p className="text-sm text-slate-400 mb-3">👮 Personal Asignado</p>
            <div className="flex items-center gap-4 bg-pnp-medium p-4 rounded-lg">
              <div
                className="w-10 h-10 rounded-full shadow-xl flex-shrink-0"
                style={{ backgroundColor: turno.persona.color }}
              ></div>
              <div>
                <p className="font-bold text-white text-xl">
                  {turno.persona.grado} {turno.persona.apellidoCompleto}
                </p>
                <p className="text-base text-slate-300">{turno.persona.nombre}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-4 rounded-xl border border-blue-700">
            <p className="text-sm text-blue-200 mb-1">⏱️ Duración del Turno</p>
            <p className="text-xl font-bold text-white">24 horas</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
