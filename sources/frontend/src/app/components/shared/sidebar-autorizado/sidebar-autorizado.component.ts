import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-autorizado.component.html',
  styleUrls: ['./sidebar-autorizado.component.css']
})
export class SidebarAutorizadoComponent {
  @Output() sidebarExpandido = new EventEmitter<boolean>();

  expandido = true;
  logoUrl: string = '/assets/images/hackermasterlogo.png';
  esPantallaPequena = false;

  // Obtiene el tamaño de la pantalla al cargar el componente y ajusta el estado del sidebar
  constructor() {
    this.esPantallaPequena = window.innerWidth <= 768;

    if (this.esPantallaPequena) {
      this.expandido = false;
      this.logoUrl = '/assets/images/logo.png';
      this.sidebarExpandido.emit(this.expandido);
    } else {
      this.expandido = true;
      this.logoUrl = '/assets/images/hackermasterlogo.png';
      this.sidebarExpandido.emit(this.expandido);
    }

  }

  // Detecta el cambio de tamaño de la pantalla y ajusta el estado del sidebar
  @HostListener('window:resize')
  onResize() {
    this.esPantallaPequena = window.innerWidth <= 768;

    if (this.esPantallaPequena) {
      this.expandido = false;
      this.logoUrl = '/assets/images/logo.png';
      this.sidebarExpandido.emit(this.expandido);
    } else {
      this.expandido = true;
      this.logoUrl = '/assets/images/hackermasterlogo.png';
      this.sidebarExpandido.emit(this.expandido);
    }

  }

  // Cambia el estado del sidebar al hacer clic en el logo
  onLogoClick(): void {
    if (!this.esPantallaPequena) {
      this.expandido = !this.expandido;
      this.logoUrl = this.expandido ? '/assets/images/hackermasterlogo.png' : '/assets/images/logo.png';
      this.sidebarExpandido.emit(this.expandido);
    }
  }
}