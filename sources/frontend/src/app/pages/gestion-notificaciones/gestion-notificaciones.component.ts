import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAdminComponent } from '../../components/shared/sidebar-admin/sidebar-admin.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-notificaciones',
  imports: [HeaderAutorizadoComponent, SidebarAdminComponent, FormsModule, CommonModule],
  templateUrl: './gestion-notificaciones.component.html',
  styleUrl: './gestion-notificaciones.component.css'
})
export class GestionNotificacionesComponent {
  sidebarExpandido = true;

  nuevaNotificacion: any = {};
  creandoNotificacion: boolean = false;
  mensajeFormNuevaNotificacion: string = '';
  mensajeErrorFormNuevaNotificacion: boolean = false;

  notificaciones: any = [];

  notificacionAEliminar: any = null;
  
  constructor(private router: Router, private authService: AuthService, private notificacionService: NotificacionService) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener las notificaciones
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getNotificaciones();
    }
  }

  // Método para obtener las notificaciones
  getNotificaciones(): void {
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (response: any) => {
        this.notificaciones = response.notificaciones;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener las notificaciones');
        }
      }
    });
  }

  // Función para manejar la selección de archivos
  selectFile(field: string) {
    const inputElement = document.getElementById(field) as HTMLInputElement;
    inputElement?.click();
  }

  // Función para manejar el archivo seleccionado
  onFileSelected(field: string, event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevaNotificacion[field] = file;
    }
  }

  // Método para crear la nueva notificación
  guardarNotificacion(crearNotificacionForm: NgForm): void {

    this.creandoNotificacion = true;

    // Comprobamos que todos los campos tienen datos
    if (!this.nuevaNotificacion.titulo || !this.nuevaNotificacion.fotoNotificacion || !this.nuevaNotificacion.fechaLimite || !this.nuevaNotificacion.descripcion) {

      this.mensajeErrorFormNuevaNotificacion = true;
      this.mensajeFormNuevaNotificacion = "Todos los campos son obligatorios";

      this.creandoNotificacion = false;

      setTimeout(() => {
        this.mensajeFormNuevaNotificacion = '';
      }, 4000);

    } else {

      const data = new FormData();

      // Añadimos la foto de la notificación al FormData
      if (this.nuevaNotificacion.fotoNotificacion) {
        data.append('fotoNotificacion', this.nuevaNotificacion.fotoNotificacion);
      }

      // Añadimos los otros datos del formulario
      data.append('titulo', this.nuevaNotificacion.titulo);
      data.append('fechaLimite', this.nuevaNotificacion.fechaLimite);
      data.append('descripcion', this.nuevaNotificacion.descripcion);

      // Subimos la nueva notificacion
      this.notificacionService.crearNotificacion(data).subscribe({
        next: (response: any) => {
          this.mensajeFormNuevaNotificacion = response.message;
          this.mensajeErrorFormNuevaNotificacion = false;

          // Reiniciamos el formulario
          crearNotificacionForm.reset();
          this.nuevaNotificacion.fotoNotificacion = null;

          this.creandoNotificacion = false;

          setTimeout(() => {
            this.mensajeFormNuevaNotificacion = '';
          }, 4000);

          // Actualizamos la lista de notificaciones
          this.getNotificaciones();

        },
        error: (error: any) => {
          this.mensajeFormNuevaNotificacion = error.error.message || 'Error al crear la notificación';
          this.mensajeErrorFormNuevaNotificacion = true;

          this.creandoNotificacion = false;

          setTimeout(() => {
            this.mensajeFormNuevaNotificacion = '';
          }, 4000);

        }
      });
    }
  }

  // Método para eliminar una notificacion
  eliminarNotificacion(idNotificacion: string): void {
    this.notificacionService.eliminarNotificacion(idNotificacion).subscribe({
      next: (response: any) => {
        // Se ha eliminado la notificación correctamente
        this.getNotificaciones();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido eliminar la notificación');
        }
      }
    });
  }

  // Método para abrir el modal de confirmación
  abrirModalEliminar(maquina: any): void {
    this.notificacionAEliminar = maquina;
  }

  // Método para cerrar el modal y confirmar la eliminación de la notificación
  confirmarEliminacion(): void {
    if (this.notificacionAEliminar) {
      this.eliminarNotificacion(this.notificacionAEliminar.idNotificacion);
      this.cerrarModal();
    }
  }

  // Método para cerrar el modal de confirmación
  cerrarModal(): void {
    this.notificacionAEliminar = null;
  }

}