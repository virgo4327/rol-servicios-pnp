export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  apellidoCompleto: string;
  grado: string;
  color: string;
  orden: number;
}

export const personal: Persona[] = [
  {
    id: 1,
    nombre: "Carlos Andrés",
    apellido: "Lozano",
    apellidoCompleto: "Lozano Amuño",
    grado: "S3 PNP",
    color: "#60a5fa",
    orden: 1
  },
  {
    id: 2,
    nombre: "Josué Tulio",
    apellido: "López",
    apellidoCompleto: "López Saavedra",
    grado: "S2 PNP",
    color: "#34d399",
    orden: 2
  },
  {
    id: 3,
    nombre: "Dante Kevin",
    apellido: "Solsol",
    apellidoCompleto: "Solsol Vela",
    grado: "S2 PNP",
    color: "#fbbf24",
    orden: 3
  },
  {
    id: 4,
    nombre: "Darlynn Ariany",
    apellido: "Olivares",
    apellidoCompleto: "Olivares Leiva",
    grado: "S2 PNP",
    color: "#c084fc",
    orden: 4
  },
  {
    id: 5,
    nombre: "Marcos Antonio",
    apellido: "Cieza",
    apellidoCompleto: "Cieza Guillen",
    grado: "ST3 PNP",
    color: "#f87171",
    orden: 5
  }
];

export interface Turno {
  fecha: Date;
  persona: Persona;
}

export const generarTurnos = (): Turno[] => {
  const turnos: Turno[] = [];
  const fechaInicio = new Date(2026, 2, 1);
  const fechaFin = new Date(2026, 11, 31); // 31 de Diciembre
  const fechaInclusionOlivares = new Date(2026, 2, 17);

  // Personal inicial (sin Olivares - ID 4)
  const personalInicial = [
    personal.find(p => p.id === 1)!, // Lozano
    personal.find(p => p.id === 2)!, // Lopez
    personal.find(p => p.id === 3)!, // Solsol
    personal.find(p => p.id === 5)!  // Cieza
  ];

  // Personal completo (incluyendo Olivares - ID 4)
  const personalCompleto = [
    personal.find(p => p.id === 1)!, // Lozano
    personal.find(p => p.id === 2)!, // Lopez
    personal.find(p => p.id === 3)!, // Solsol
    personal.find(p => p.id === 4)!, // Olivares
    personal.find(p => p.id === 5)!  // Cieza
  ];

  let fechaActual = new Date(fechaInicio);
  let indexTurno = 0;

  while (fechaActual <= fechaFin) {
    let persona: Persona;
    
    if (fechaActual < fechaInclusionOlivares) {
      // Antes del 17 de marzo: rotación de 4
      persona = personalInicial[indexTurno % personalInicial.length];
    } else {
      // Desde el 17 de marzo: rotación de 5
      // Reiniciamos o ajustamos el index para que el 17 le toque a Lozano (index 0)
      if (fechaActual.getTime() === fechaInclusionOlivares.getTime()) {
        indexTurno = 0;
      }
      persona = personalCompleto[indexTurno % personalCompleto.length];
    }

    turnos.push({
      fecha: new Date(fechaActual),
      persona: persona
    });

    // Avanzar 2 días
    fechaActual.setDate(fechaActual.getDate() + 2);
    indexTurno++;
  }
  
  return turnos;
};

export const obtenerProximoTurno = (turnos: Turno[]): Turno | null => {
  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0);
  const futuros = turnos.filter(t => {
    const fechaTurno = new Date(t.fecha);
    fechaTurno.setHours(0, 0, 0, 0);
    return fechaTurno >= ahora;
  });
  return futuros.length > 0 ? futuros[0] : null;
};
