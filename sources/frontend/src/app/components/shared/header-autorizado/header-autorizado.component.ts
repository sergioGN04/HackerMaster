import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-autorizado.component.html',
  styleUrls: ['./header-autorizado.component.css']
})
export class HeaderAutorizadoComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() username!: string;

  menuPerfilAbierto = false;

  constructor(private authService: AuthService, private router: Router) { }

  // Método para expandir o colapsar el sidebar
  onLogoClick() {
    this.toggleSidebar.emit();
  }

  // Método para abrir el menú de perfil
  toggleMenuPerfil(event: Event) {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.eliminarToken();
    this.router.navigate(['/login']);
  }

  // Método para cerrar el menú de perfil al hacer clic fuera de él
  @HostListener('document:click', ['$event'])
  cerrarSiClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.perfil')) {
      this.menuPerfilAbierto = false;
    }
  }
  
}