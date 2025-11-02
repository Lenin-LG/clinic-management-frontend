import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 p-6 bg-gray-50 min-h-screen">
      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 class="text-3xl font-extrabold text-teal-900">Dashboard Clínica</h1>
        <p class="text-teal-700">Bienvenido al sistema de Clinica de Vida</p>
      </div>

      <!-- Tarjetas principales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Pacientes -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-300 text-white shadow-md transform transition hover:scale-105 cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">Pacientes Hoy</div>
            <svg class="h-6 w-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z"/>
            </svg>
          </div>
          <div class="mt-3 text-3xl font-bold">123</div>
        </div>

        <!-- Citas -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-white shadow-md transform transition hover:scale-105 cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">Citas Próximas</div>
            <svg class="h-6 w-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div class="mt-3 text-3xl font-bold">45</div>
        </div>

        <!-- Doctores -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-300 text-white shadow-md transform transition hover:scale-105 cursor-pointer">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">Doctores Disponibles</div>
            <svg class="h-6 w-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9v-1c0-2.76 3.58-5 8-5s8 2.24 8 5v1H5Zm13-11h-2V8a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z"/>
            </svg>
          </div>
          <div class="mt-3 text-3xl font-bold">12</div>
        </div>
      </div>

      <!-- Mini gráficas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <!-- Pacientes -->
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-teal-900 font-semibold mb-3">Pacientes por Mes</h3>
          <div class="h-40 bg-teal-50 rounded-lg flex items-end gap-1 p-2">
            <div *ngFor="let val of [5, 8, 12, 7, 10, 15, 9]"
                 class="bg-teal-400 w-6 rounded-t-lg"
                 [style.height.%]="val*5">
            </div>
          </div>
        </div>

        <!-- Citas -->
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-cyan-900 font-semibold mb-3">Citas Semanales</h3>
          <div class="h-40 bg-cyan-50 rounded-lg flex items-end gap-1 p-2">
            <div *ngFor="let val of [3, 5, 7, 6, 4, 8, 5]"
                 class="bg-cyan-400 w-6 rounded-t-lg"
                 [style.height.%]="val*10">
            </div>
          </div>
        </div>

        <!-- Doctores -->
        <div class="p-6 bg-white rounded-2xl shadow-sm">
          <h3 class="text-lime-900 font-semibold mb-3">Doctores Activos</h3>
          <div class="h-40 bg-lime-50 rounded-lg flex items-end gap-1 p-2">
            <div *ngFor="let val of [1, 2, 1, 3, 2, 1, 2]"
                 class="bg-lime-400 w-6 rounded-t-lg"
                 [style.height.%]="val*20">
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
