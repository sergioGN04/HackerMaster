import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaquinaService } from '../../core/services/maquina.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-maquina-detalles',
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule, FormsModule],
  templateUrl: './maquina-detalles.component.html',
  styleUrl: './maquina-detalles.component.css'
})
export class MaquinaDetallesComponent {
  sidebarExpandido = true;
  maquinaDetalles: any = { Usuario: {} };

  flagUsuario: string = '';
  flagRoot: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private maquinaService: MaquinaService) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener los detalles de la máquina
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.getObtenerDetallesMaquina(id);
      }
    }
  }

  getObtenerDetallesMaquina(id: string): void {
    this.maquinaService.obtenerDetallesMaquina(id).subscribe({
      next: (response: any) => {
        this.maquinaDetalles = response.maquina;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener los detalles de la máquina');
        }
      }
    });
  }

}