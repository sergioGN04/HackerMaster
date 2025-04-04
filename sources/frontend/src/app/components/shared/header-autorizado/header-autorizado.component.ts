import { Component, EventEmitter, HostListener, Output } from '@angular/core';
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

  nombreUsuario = 'usuario';
  menuPerfilAbierto = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogoClick() {
    this.toggleSidebar.emit();
  }

  toggleMenuPerfil(event: Event) {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  cerrarSiClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.perfil')) {
      this.menuPerfilAbierto = false;
    }
  }
  
}