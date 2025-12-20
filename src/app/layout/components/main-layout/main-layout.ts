import {
  Component,
  HostListener,
  signal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../core/auth/services/auth.service';
import { ChatWidgetComponent } from '../../../features/chat/chat-widget.component';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface UserMenuItem {
  label: string;
  icon: string;
  route?: string;
  danger?: boolean;
  dividerAbove?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,ChatWidgetComponent],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {
  sidebarOpen = signal(false);
  userMenuOpen = signal(false);
userName = signal<string>(localStorage.getItem('nombre') || 'Usuario');
  userRole = signal<string>(localStorage.getItem('role') || 'Personal');
  userInitial = signal<string>('');

  navItems = signal<NavItem[]>([
    {label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2 4 4L21 4l2 2L9 20 3 14z'},
    {
      label: 'Citas',
      path: '/citas',
      icon: 'M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-1-1H6Zm14 7H2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9Zm-7 3v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 1 1 2 0Z'
    },
    { label: 'Pacientes',
      path: '/pacientes',
      icon: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'
    },
    {
      label: 'Especialidades',
      path: '/especialidades',
      icon: 'M4 22h16V8h-3V4H7v4H4v14Zm5-10h6v6h-6v-6Zm-2 10v-8h10v8H7Zm2-12h6V6H9v4Z'
    },
    {
      label: 'Medicos',
      path: '/medicos',
      icon: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9v-1c0-2.76 3.58-5 8-5s8 2.24 8 5v1H5Zm13-11h-2V8a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z'
    },
  ]);

  userMenuItems: UserMenuItem[] = [
    {
      label: 'Ver Perfil',
      icon: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 6v2h16v-2c0-3.33-2.67-6-8-6Z',
      route: '/profile'
    },
    {label: 'Configuración', icon: 'M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z', route: '/settings', dividerAbove: true},
    {
      label: 'Cerrar Sesión',
      icon: 'M16 13H7v-2h9V8l5 4-5 4v-3Z',
      danger: true,
      dividerAbove: true,
      action: () => this.logout()
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.userInitial.set(this.userName().charAt(0).toUpperCase());
    const rolRaw = this.userRole();
  if (rolRaw === rolRaw.toUpperCase()) {
    const formatted = rolRaw.charAt(0).toUpperCase() + rolRaw.slice(1).toLowerCase();
    this.userRole.set(formatted);
  }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.userMenuOpen.set(false);
  }

  handleMenuItem(item: UserMenuItem) {
    if (item.action) {
      item.action();
    }
    this.closeUserMenu();
  }

  logout() {
    const success = this.authService.signOut();
    if (success) {
      console.log('Sesión cerrada exitosamente');
      this.router.navigate(['/auth/login']);
    } else {
      console.error('Error al cerrar sesión');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeUserMenu();
    }
  }

}
