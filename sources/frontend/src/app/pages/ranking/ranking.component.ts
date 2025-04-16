import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent,CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent {
  sidebarExpandido = true;
  rankingUsuarios: any;

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener el ranking de usuarios
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getInformacionPerfil();
    }
  }

  getInformacionPerfil(): void {
    this.usuarioService.obtenerRanking().subscribe({
      next: (response: any) => {
        this.rankingUsuarios = response.ranking;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener el ranking de usuarios');
        }
      }
    });
  }

}