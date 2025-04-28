import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { LogroService } from '../../core/services/logro.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  sidebarExpandido = true;
  informacionUsuario: any;
  logrosObtenidos: any;
  logrosNuevos: any = [];

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private logroService: LogroService) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener la informacion del usuario
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getInformacionPerfil();
    }
  }

  // Método para obtener la información del usuario
  getInformacionPerfil(): void {
    this.usuarioService.obtenerInformacionUsuario().subscribe({
      next: (response: any) => {
        this.informacionUsuario = response;

        // Obtener los logros del usuario
        this.getLogrosUsuario();

      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener la información del usuario');
        }
      }
    });
  }

  // Método para obtener los logros del usuario
  getLogrosUsuario(): void {
    this.logroService.obtenerLogrosUsuario(this.informacionUsuario.usuario.idUsuario).subscribe({
      next: (response: any) => {
        this.logrosObtenidos = response.logros;

        // Obtener si hay logros nuevos
        this.logrosNuevos = this.logrosObtenidos.filter((logro: any) => logro.UsuarioLogros[0].nuevoLogro === true);

      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener los logros del usuario');
        }
      }
    });
  }

  // Método para cerrar el modal de logros, actualizando los logros nuevos para que no sean nuevos
  cerrarModalLogros() {
    if (this.logrosNuevos.length > 0) {
      this.logroService.actualizarLogrosNuevos(this.informacionUsuario.usuario.idUsuario).subscribe({
        next: () => {
          // Se ha actualizado correctamente los logros

          // Actualizamos la lista de logros obtenidos
          this.logrosNuevos = [];
        },
        error: (error: any) => {
          console.error('Error actualizando logros nuevos', error);
        }
      });
    }
  }

}