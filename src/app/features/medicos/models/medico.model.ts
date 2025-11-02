export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Medico {
  id: number;
  nombres: string;
  apellidos: string;
  cmp: string;
  especialidad: Especialidad;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string | null;
}

export interface MedicoResponse {
  content: Medico[];
  totalPages: number;
  number: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
}
