export interface Cita {
  id: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm:ss
  idPaciente: number;
  idMedico: number;
  pacienteNombreCompleto: string;
  especialidad: string;
  medicoNombreCompleto: string;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
}

export interface CitaResponse {
  content: Cita[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
