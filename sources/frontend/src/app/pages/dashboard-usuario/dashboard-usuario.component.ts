import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaquinaService } from '../../core/services/maquina.service';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css'
})
export class DashboardUsuarioComponent {
  sidebarExpandido = true;
  resumen: any = null;
  username: string = '';
  maquinasRecomendadas: any[] = [];
  maquinasEnProgreso: any[] = [];
  activeTab: string = 'recomendadas';

  constructor(private usuarioService: UsuarioService, private maquinaService: MaquinaService, private authService: AuthService, private router: Router) { }

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

  getResumenUsuario(): void {
    this.usuarioService.obtenerResumenUsuario().subscribe({
      next: (response: any) => {
        this.resumen = response;
        this.username = this.resumen?.nombreUsuario;

        // Obtenemos las máquinas recomendadas del usuario
        this.getMaquinasRecomendadas();

        // Obtenemos las máquinas en progreso del usuario
        this.getMaquinasEnProgreso();

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

  // Método para obtener las máquinas recomendadas del usuario
  getMaquinasRecomendadas(): void {
    this.maquinaService.obtenerMaquinasRecomendadas(this.resumen.rango).subscribe({
      next: (response: any) => {
        this.maquinasRecomendadas = response;
      },
      error: (error: any) => {
        console.error('Error - No se ha podido obtener las máquinas recomendadas del usuario');
      }
    });
  }

  // Método para cambiar entre las pestañas de máquinas recomendadas y en progreso
  cambiarPestania(tab: string): void {
    this.activeTab = tab;
  }


  // Método para obtener las máquinas en progreso del usuario
  getMaquinasEnProgreso(): void {
    this.maquinaService.obtenerMaquinasEnProgreso().subscribe({
      next: (response: any) => {
        this.maquinasEnProgreso = response;
      },
      error: (error: any) => {
        console.error(error.error.message);
      }
    });
  }

}