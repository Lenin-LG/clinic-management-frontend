import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, pipe} from 'rxjs';
import { Paciente } from '../models/paciente.models';
import {environment} from '../../../../evironments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  readonly _httpClient =  inject(HttpClient);
  private readonly baseUrl= environment.apiUrl;

  // 📌 Listar pacientes con paginación
  getPacientes(page: number = 0, size: number = 1000): Observable<any> {
    return this._httpClient.get<any>(`${this.baseUrl}/api/pacientes?page=${page}&size=${size}`);
  }

  // 📌 Obtener paciente por ID
  getPacienteById(id: number): Observable<Paciente> {
    return this._httpClient.get<Paciente>(`${this.baseUrl}/api/pacientes${id}`);
  }

  // 📌 Crear paciente
  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this._httpClient.post<Paciente>(this.baseUrl, paciente);
  }

  // 📌 Actualizar paciente
  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this._httpClient.put<Paciente>(`${this.baseUrl}/${id}`, paciente);
  }

  // 📌 Eliminar paciente
  deletePaciente(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
