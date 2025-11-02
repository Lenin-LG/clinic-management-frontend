import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {environment} from '../../../../evironments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  readonly _httpClient =  inject(HttpClient);
  private readonly baseUrl= environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMedicos(page: number=0, size: number=1000): Observable<any> {
    return this._httpClient.get<{ data: any }>(`${this.baseUrl}/api/medicos?page=${page}&size=${size}`);
  }
}
