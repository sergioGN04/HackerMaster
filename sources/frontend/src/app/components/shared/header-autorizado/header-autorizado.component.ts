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
  username: string = '';
  rol: string = '';

  menuPerfilAbierto = false;
  menuNotificacionesAbierto = false;

  notificaciones: any[] = [];
  marcarNotificaciones = false;

  constructor(private authService: AuthService, private notificacionService: NotificacionService, private router: Router) { }

  ngOnInit() {
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones() {
    this.notificacionService.obtenerNotificacionesUsuario().subscribe({
      next: (response: any) => {
        this.username = response.username;
        this.rol = response.rol;
        this.notificaciones = response.nuevasNotificaciones;
      },
      error: (error: any) => {
        console.error(error.error.message);
      }
    });
  }

  // Método para navegar entre las páginas de administración y el dashboard-usuario
  navegarPaginaAdmin() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/admin')) {
      this.router.navigate(['/dashboard-usuario']);
    } else if (this.rol === 'Administrador') {
      this.router.navigate(['/admin/gestion-usuarios']);
    } else {
      console.log('Error - Solo administradores pueden acceder al panel de administración');
    }
  }

  // Método para desplegar o no el menú del perfil
  toggleMenuPerfil(event: Event) {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  // Método para desplegar o no el menú de notificaciones y marcar las notificaciones en visto
  toggleMenuNotificaciones(event: Event) {
    event.stopPropagation();
    this.menuNotificacionesAbierto = !this.menuNotificacionesAbierto;

    if (!this.marcarNotificaciones) {

      this.marcarNotificaciones = true;

      let notificaciones = this.notificaciones.map(n => n.idNotificacion);

      this.notificacionService.marcarNotificaciones(notificaciones).subscribe({
        next: (response: any) => {
          // Se ha marcado las notificaciones correctamente
        },
        error: (error: any) => {
          console.error(error.error.message);
        }
      });

    }

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