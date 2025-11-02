export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface EspecialidadResponse {
  data: {
    content: Especialidad[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}
