import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente.models';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente.component.html'
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  totalPages = 0;
  currentPage = 0;
  size = 10;
  loading = false;
  viewMode: 'table' | 'cards' = 'table'; // 👈 Cambiar vista

  constructor(
    private pacienteService: PacienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(page: number = 0): void {
    this.loading = true;
    this.pacienteService.getPacientes(page, this.size).subscribe({
      next: (res) => {
        this.pacientes = res.content;
        this.totalPages = res.totalPages ?? 0;
        this.currentPage = res.number ?? 0;
        this.loading = false;

        this.cdr.detectChanges(); // 👈 Para forzar render si usas zoneless
      },
      error: (err) => {
        console.error('Error cargando pacientes', err);
        this.loading = false;
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.loadPacientes(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadPacientes(this.currentPage + 1);
    }
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }
}
