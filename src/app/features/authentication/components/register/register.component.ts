import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor() {
    this.form = this._fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this._authService.signUp(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        // Una vez registrado, lo mandamos al login
        this._router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al crear la cuenta';
      }
    });
  }
}