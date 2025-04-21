import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAdminComponent } from '../../components/shared/sidebar-admin/sidebar-admin.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAdminComponent,CommonModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  sidebarExpandido = true;
  usuariosRegistrados: any = [];

  constructor(private authService: AuthService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener los usuarios registrados
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getUsuariosRegistrados();
    }
  }

  getUsuariosRegistrados(): void {
    this.usuarioService.obtenerUsuariosRegistrados().subscribe({
      next: (response: any) => {
        this.usuariosRegistrados = response.usuariosRegistrados;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener los usuarios registrados');
        }
      }
    });
  }

  // Método para cambiar el rol del usuario
  cambiarRol(idUsuario: string): void {
    this.usuarioService.cambiarRol(idUsuario).subscribe({
      next: (response: any) => {
        this.getUsuariosRegistrados();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener los usuarios registrados');
        }
      }
    });
  }

  // Método para eliminar un usuario
  eliminarUsuario(idUsuario: any): void {
    this.usuarioService.eliminarUsuario(idUsuario).subscribe({
      next: (response: any) => {
        this.getUsuariosRegistrados();
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener los usuarios registrados');
        }
      }
    });
  }

}