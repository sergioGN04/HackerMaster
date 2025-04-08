import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  sidebarExpandido = true;
  informacionUsuario: any;

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService) {}

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

  getInformacionPerfil(): void {
    this.usuarioService.obtenerInformacionUsuario().subscribe({
      next: (response: any) => {
        this.informacionUsuario = response;
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

}