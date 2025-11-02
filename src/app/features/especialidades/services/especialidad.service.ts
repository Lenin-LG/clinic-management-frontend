import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Especialidad } from '../models/especialidad.model';
import {environment} from '../../../../evironments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  readonly _httpClient =  inject(HttpClient);
  private readonly baseUrl= environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Listar especialidades paginadas
  getEspecialidades(page: number = 0, size: number = 6): Observable<any> {
  return this._httpClient
    .get<any>(`${this.baseUrl}/api/especialidades?page=${page}&size=${size}`)
    .pipe(map(response => response.content)); 
  }

  // TODO: implementar el resto del CRUD
/*  // Obtener especialidad por id
  getEspecialidadById(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva especialidad
  createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.apiUrl, especialidad);
  }

  // Actualizar especialidad
  updateEspecialidad(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.apiUrl}/${id}`, especialidad);
  }

  // Eliminar especialidad
  deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }*/
}
