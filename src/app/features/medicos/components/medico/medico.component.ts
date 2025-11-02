import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medico.component.html'
})
export class MedicoComponent implements OnInit {
  medicos: Medico[] = [];
  totalPages = 0;
  currentPage = 0;
  size = 10;
  loading = false;

  constructor(
    private medicoService: MedicoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(page: number = 0): void {
    this.loading = true;
    this.medicoService.getMedicos(page, this.size).subscribe({
      next: (res) => {
        this.medicos = res.content;
        this.totalPages = res.totalPages ?? 0;
        this.currentPage = res.number ?? 0;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando médicos', err);
        this.loading = false;
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.loadMedicos(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadMedicos(this.currentPage + 1);
    }
  }
}
