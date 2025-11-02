import {Routes} from '@angular/router';
import {MainLayoutComponent} from './layout/components/main-layout/main-layout';
import {DashboardComponent} from './features/dashboard/dashboard';
import {AuthGuard} from './core/auth/guards/auth.guard';
import {CitaMedicaComponent} from './features/citas/components/cita-medica/cita-medica.component';
import {PacienteComponent} from './features/pacientes/components/paciente/paciente.component';
import {EspecialidadComponent} from './features/especialidades/components/especialidad/especialidad.component';
import {MedicoComponent} from './features/medicos/components/medico/medico.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'citas', component: CitaMedicaComponent},
      {path: 'pacientes', component: PacienteComponent},
      {path: 'especialidades', component: EspecialidadComponent},
      {path: 'medicos', component: MedicoComponent},
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/authentication/authentication.routes').then(m => m.AUTH_ROUTES)
  },
  {path: '**', redirectTo: ''}
];
