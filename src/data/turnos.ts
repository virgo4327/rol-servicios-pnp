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
    nombre: "Segundo Jorge",
    apellido: "Fasanando",
    apellidoCompleto: "Fasanando Urari",
    grado: "S3 PNP",
    color: "#60a5fa",
    orden: 1
  },
  {
    id: 2,
    nombre: "Staily Alexandro",
    apellido: "Vela",
    apellidoCompleto: "Vela Chuquival",
    grado: "S3 PNP",
    color: "#34d399",
    orden: 2
  },
  {
    id: 3,
    nombre: "Carlos Andrés",
    apellido: "Lozano",
    apellidoCompleto: "Lozano Amuño",
    grado: "S3 PNP",
    color: "#fbbf24",
    orden: 3
  },
  {
    id: 4,
    nombre: "Josué Tulio",
    apellido: "López",
    apellidoCompleto: "López Saavedra",
    grado: "S2 PNP",
    color: "#c084fc",
    orden: 4
  },
  {
    id: 5,
    nombre: "Dante Kevin",
    apellido: "Solsol",
    apellidoCompleto: "Solsol Vela",
    grado: "S2 PNP",
    color: "#f87171",
    orden: 5
  },
  {
    id: 6,
    nombre: "Darlynn Ariany",
    apellido: "Olivares",
    apellidoCompleto: "Olivares Leiva",
    grado: "S2 PNP",
    color: "#a78bfa",
    orden: 6
  },
  {
    id: 7,
    nombre: "Marcos Antonio",
    apellido: "Cieza",
    apellidoCompleto: "Cieza Guillen",
    grado: "ST3 PNP",
    color: "#fb923c",
    orden: 7
  }
];

export interface Turno {
  fecha: Date;
  persona: Persona;
}

export const generarTurnos = (): Turno[] => {
  const turnos: Turno[] = [];
  const fechaInicio = new Date(2026, 2, 1);   // 1 de marzo
  const fechaFin = new Date(2026, 11, 31);      // 31 de diciembre
  const fechaInclusionOlivares = new Date(2026, 2, 17);  // 17 de marzo
  const fechaInclusionNuevos = new Date(2026, 4, 28);   // 28 de mayo

  // Personal inicial (sin Olivares) - ids: 3,4,5,7 (Lozano, López, Solsol, Cieza)
  const personalInicial = [
    personal.find(p => p.id === 3)!, // Lozano
    personal.find(p => p.id === 4)!, // López
    personal.find(p => p.id === 5)!, // Solsol
    personal.find(p => p.id === 7)!  // Cieza
  ];

  // Personal intermedio (+ Olivares) - ids: 3,4,5,6,7
  const personalIntermedio = [
    personal.find(p => p.id === 3)!, // Lozano
    personal.find(p => p.id === 4)!, // López
    personal.find(p => p.id === 5)!, // Solsol
    personal.find(p => p.id === 6)!, // Olivares
    personal.find(p => p.id === 7)!  // Cieza
  ];

  // Personal completo (7 integrantes) - orden: 1,2,3,4,6,7 (Fasanando, Vela, Lozano, López, Solsol, Olivares, Cieza)
  const personalCompleto = [
    personal.find(p => p.id === 1)!, // Fasanando
    personal.find(p => p.id === 2)!, // Vela
    personal.find(p => p.id === 3)!, // Lozano
    personal.find(p => p.id === 4)!, // López
    personal.find(p => p.id === 5)!, // Solsol
    personal.find(p => p.id === 6)!, // Olivares
    personal.find(p => p.id === 7)!  // Cieza
  ];

  let fechaActual = new Date(fechaInicio);
  let indexTurno = 0;

  while (fechaActual <= fechaFin) {
    let persona: Persona;

    if (fechaActual < fechaInclusionOlivares) {
      // 1-16 marzo: rotación de 4 (Lozano, López, Solsol, Cieza)
      persona = personalInicial[indexTurno % personalInicial.length];
    } else if (fechaActual < fechaInclusionNuevos) {
      // 17 marzo - 27 mayo: rotación de 5 (+ Olivares)
      if (fechaActual.getTime() === fechaInclusionOlivares.getTime()) {
        indexTurno = 3; // Ajuste para mantener secuencia
      }
      persona = personalIntermedio[indexTurno % personalIntermedio.length];
    } else {
      // 28 mayo en adelante: rotación de 7
      if (fechaActual.getTime() === fechaInclusionNuevos.getTime()) {
        indexTurno = 0; // Reinicia para que 28 mayo sea Fasanando
      }
      persona = personalCompleto[indexTurno % personalCompleto.length];
    }

    turnos.push({
      fecha: new Date(fechaActual),
      persona: persona
    });

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
