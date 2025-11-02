import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CitaResponse } from '../models/cita.models';
import {environment} from '../../../../evironments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  readonly _httpClient =  inject(HttpClient);
  private readonly baseUrl= environment.apiUrl;


 getCitas(page: number = 0, size: number = 5): Observable<CitaResponse> {
  return this._httpClient.get<CitaResponse>(
    `${this.baseUrl}/api/citas?page=${page}&size=${size}`
  );
}

  //Crear nueva cita
  crearCita(cita: any): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}/api/citas`, cita);
  }
  //Actualizar  cita
  actualizarCita(id: number, cita: any) {
    return this._httpClient.put<any>(`${this.baseUrl}/api/citas/${id}`, cita);
  }

  //Eliminar cita
  eliminarCita(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${this.baseUrl}/api/citas/${id}`);
  }
}
