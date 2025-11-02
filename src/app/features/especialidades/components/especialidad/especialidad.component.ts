import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../models/especialidad.model';
import { EspecialidadService } from '../../services/especialidad.service';

@Component({
  selector: 'app-especialidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialidad.component.html'
})
export class EspecialidadComponent implements OnInit {
  especialidades: Especialidad[] = [];
  totalPages = 0;
  currentPage = 0;
  size = 6;
  loading = false;

  constructor(
    private especialidadService: EspecialidadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(page: number = 0): void {
    this.loading = true;
    this.especialidadService.getEspecialidades(page, this.size).subscribe({
      next: (res) => {
        this.especialidades = res;
        this.totalPages = res.totalPages ?? 0;
        this.currentPage = res.number ?? 0;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando especialidades', err);
        this.loading = false;
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.loadEspecialidades(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadEspecialidades(this.currentPage + 1);
    }
  }

}
