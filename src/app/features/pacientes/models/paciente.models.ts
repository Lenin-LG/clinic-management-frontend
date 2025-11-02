export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
}

// Modelo para la respuesta paginada
export interface PacientePage {
  content: Paciente[];
  totalElements: number;
  totalPages: number;
  number: number; // número de página actual
  size: number;   // tamaño de página
  first: boolean;
  last: boolean;
}
