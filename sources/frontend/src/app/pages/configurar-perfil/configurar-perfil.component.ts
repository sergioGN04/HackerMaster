import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configurar-perfil',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule],
  templateUrl: './configurar-perfil.component.html',
  styleUrl: './configurar-perfil.component.css'
})
export class ConfigurarPerfilComponent {
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

  // 
  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];
  
      // Validaciones
      if (archivo.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo permitido: 5MB.');
        return;
      }
  
      // Obtener archivo seleccionado
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.informacionUsuario.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(archivo);

      console.log(reader);
      
  
      // Llamar al servicio que sube la imagen
      // this.usuarioService.actualizarInformacionUsuario(informacion).subscribe(...)
      
    }
  }  

}