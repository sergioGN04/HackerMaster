import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-header-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-autorizado.component.html',
  styleUrls: ['./header-autorizado.component.css']
})
export class HeaderAutorizadoComponent {
  @Input() username!: string;

  menuPerfilAbierto = false;
  menuNotificacionesAbierto = false;

  notificaciones: any[] = [];

  constructor(private authService: AuthService, private notificacionService: NotificacionService, private router: Router) { }

  ngOnInit() {
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones() {
    this.notificacionService.obtenerNotificacionesUsuario().subscribe({
      next: (response: any) => {
        this.notificaciones = response;
      },
      error: (error: any) => {
        console.error(error.error.message);
      }
    });
  }

  toggleMenuPerfil(event: Event) {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  toggleMenuNotificaciones(event: Event) {
    event.stopPropagation();
    this.menuNotificacionesAbierto = !this.menuNotificacionesAbierto;
  }

  cerrarSesion() {
    this.authService.eliminarToken();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  cerrarSiClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.perfil') && !target.closest('.notificaciones')) {
      this.menuPerfilAbierto = false;
      this.menuNotificacionesAbierto = false;
    }
  }

}