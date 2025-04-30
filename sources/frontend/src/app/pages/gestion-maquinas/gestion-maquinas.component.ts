import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAdminComponent } from '../../components/shared/sidebar-admin/sidebar-admin.component';
import { AuthService } from '../../core/auth/auth.service';
import { MaquinaService } from '../../core/services/maquina.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-maquinas',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAdminComponent, CommonModule],
  templateUrl: './gestion-maquinas.component.html',
  styleUrl: './gestion-maquinas.component.css'
})
export class GestionMaquinasComponent {
  sidebarExpandido = true;
  solicitudesMaquinas: any = [];
  maquinasRegistradas: any = [];

  maquinaAEliminar: any = null;

  constructor(private authService: AuthService, private maquinaService: MaquinaService, private router: Router) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener las maquinas
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getSolicitudesMaquinas();
      this.getMaquinasRegistradas();
    }
  }

  // Método para obtener las solicitudes de máquinas
  getSolicitudesMaquinas(): void {
    this.maquinaService.obtenerSolicitudesMaquinas().subscribe({
      next: (response: any) => {
        this.solicitudesMaquinas = response.solicitudesMaquinas;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener las solicitudes de máquinas');
        }
      }
    });
  }

  // Método para obtener las máquinas registradas
  getMaquinasRegistradas(): void {
    this.maquinaService.obtenerMaquinasRegistradas().subscribe({
      next: (response: any) => {
        this.maquinasRegistradas = response.maquinasRegistradas;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener las máquinas registradas');
        }
      }
    });
  }

  // Método para aceptar una solicitud de máquina
  aceptarSolicitud(idMaquina: string): void {
    this.maquinaService.aceptarSolicitud(idMaquina).subscribe({
      next: (response: any) => {
        // Se ha aceptado la solicitud correctamente
        this.getSolicitudesMaquinas();
        this.getMaquinasRegistradas();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido aceptar la solicitud de la máquina');
        }
      }
    });
  }

  // Método para denegar una solicitud de máquina
  denegarSolicitud(idMaquina: string): void {
    this.maquinaService.denegarSolicitud(idMaquina).subscribe({
      next: (response: any) => {
        // Se ha denegado la solicitud correctamente
        this.getSolicitudesMaquinas();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido denegar la solicitud de la máquina');
        }
      }
    });
  }

  // Método para eliminar una máquina, sus archivos y sus datos
  eliminarMaquina(idMaquina: string): void {
    this.maquinaService.eliminarMaquina(idMaquina).subscribe({
      next: (response: any) => {
        // Se ha eliminado la maquina correctamente
        this.getMaquinasRegistradas();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido eliminar la máquina');
        }
      }
    });
  }

    // Método para abrir el modal de confirmación
    abrirModalEliminar(maquina: any): void {
      this.maquinaAEliminar = maquina;
    }
  
    // Método para cerrar el modal y confirmar la eliminación de la máquina
    confirmarEliminacion(): void {
      if (this.maquinaAEliminar) {
        this.eliminarMaquina(this.maquinaAEliminar.idMaquina);
        this.cerrarModal();
      }
    }
  
    // Método para cerrar el modal de confirmación
    cerrarModal(): void {
      this.maquinaAEliminar = null;
    }

}