import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-autorizado.component.html',
  styleUrls: ['./header-autorizado.component.css']
})
export class HeaderAutorizadoComponent {
  nombreUsuario = 'usuario';
  menuPerfilAbierto = false;

  toggleMenuPerfil(event: Event) {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  cerrarSesion() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  @HostListener('document:click', ['$event'])
  cerrarSiClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.perfil')) {
      this.menuPerfilAbierto = false;
    }
  }
  
}