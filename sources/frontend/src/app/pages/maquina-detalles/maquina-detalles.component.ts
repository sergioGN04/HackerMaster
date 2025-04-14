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

  idMaquina: any;

  maquinaDetalles: any = { Usuario: {} };

  accionEnCurso: boolean = false;

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
      this.idMaquina = this.route.snapshot.paramMap.get('id');
      if (this.idMaquina) {
        this.getObtenerDetallesMaquina(this.idMaquina);
      }
    }
  }

  getObtenerDetallesMaquina(idMaquina: string): void {
    this.maquinaService.obtenerDetallesMaquina(idMaquina).subscribe({
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

  // Método para crear el contenedor de la máquina
  iniciarMaquina(): void {
    if (this.accionEnCurso) return;

    this.accionEnCurso = true;
    this.maquinaService.desplegarMaquina(this.idMaquina).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.accionEnCurso = false;
          this.maquinaDetalles.ip = response.ip;
          this.maquinaDetalles.estado = 'desplegada';
        }, 5000);
      },
      error: (error) => {
        this.accionEnCurso = false;
        console.error('Error - No se ha podido desplegar la máquina');
      }
    });
  }

  // Método para detener el contenedor de la máquina
  detenerMaquina(): void {
    if (this.accionEnCurso || !this.maquinaDetalles.ip) return;

    this.accionEnCurso = true;
    this.maquinaService.detenerMaquina(this.idMaquina).subscribe({
      next: (response) => {
        this.accionEnCurso = false;
        if (response.success) {
          this.maquinaDetalles.ip = null;
          this.maquinaDetalles.estado = '';
        } else {
          this.accionEnCurso = false;
          console.error(response.message);
        }
      },
      error: (error) => {
        console.error(error);
        console.error('Error - No se ha podido detener la máquina');
      }
    });
  }

}