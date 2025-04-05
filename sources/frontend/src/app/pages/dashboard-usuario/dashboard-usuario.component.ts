import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css'
})
export class DashboardUsuarioComponent {
  sidebarExpandido = true;
  resumen: any;

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener el resumen del usuario
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getResumenUsuario();
    }
  }

  // Método para obtener el resumen del usuario
  getResumenUsuario(): void {
    this.usuarioService.obtenerResumenUsuario().subscribe({
      next: (response: any) => {
        this.resumen = response;
        
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);

          this.authService.eliminarToken();
          this.router.navigate(['/login']);

        } else {
          console.error('Error - No se ha podido obtener el resumen del usuario');
        }
      }
    });
  }

  // Método para expandir o colapsar el sidebar
  toggleSidebar() {
    this.sidebarExpandido = !this.sidebarExpandido;
  }

}