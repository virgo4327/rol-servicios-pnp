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
  const turnos: Turno[] = [
    { fecha: new Date(2026, 2, 1), persona: personal[0] }, // Lozano
    { fecha: new Date(2026, 2, 3), persona: personal[1] }, // Lopez
    { fecha: new Date(2026, 2, 5), persona: personal[2] }, // Solsol
    { fecha: new Date(2026, 2, 7), persona: personal[4] }, // Cieza
    { fecha: new Date(2026, 2, 9), persona: personal[0] }, // Lozano
    { fecha: new Date(2026, 2, 11), persona: personal[1] }, // Lopez
    { fecha: new Date(2026, 2, 13), persona: personal[2] }, // Solsol
    { fecha: new Date(2026, 2, 15), persona: personal[4] }, // Cieza
    { fecha: new Date(2026, 2, 17), persona: personal[0] }, // Lozano
    { fecha: new Date(2026, 2, 19), persona: personal[1] }, // Lopez
    { fecha: new Date(2026, 2, 21), persona: personal[2] }, // Solsol
    { fecha: new Date(2026, 2, 23), persona: personal[4] }, // Cieza
    { fecha: new Date(2026, 2, 25), persona: personal[0] }, // Lozano
    { fecha: new Date(2026, 2, 27), persona: personal[1] }, // Lopez
    { fecha: new Date(2026, 2, 29), persona: personal[2] }, // Solsol
    { fecha: new Date(2026, 2, 31), persona: personal[4] }, // Cieza
  ];
  
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
