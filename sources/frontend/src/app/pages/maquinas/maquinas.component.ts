import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MaquinaService } from '../../core/services/maquina.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-maquinas',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule, FormsModule],
  templateUrl: './maquinas.component.html',
  styleUrls: ['./maquinas.component.css']
})
export class MaquinasComponent {
  sidebarExpandido = true;

  nuevaMaquina: any = {};
  mensajeFormNuevaMaquina: string = '';
  mensajeErrorFormNuevaMaquina: boolean = false;

  busqueda = '';
  listaMaquinas: any[] = [];

  constructor(private router: Router, private authService: AuthService, private maquinaService: MaquinaService) { }

  ngOnInit(): void {
    this.comprobarToken();
  }

  // Método para comprobar si el token existe y si es válido obtener las maquinas
  comprobarToken(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getObtenerMaquinas(this.busqueda);
    }
  }

  getObtenerMaquinas(busqueda: string) {
    this.maquinaService.obtenerMaquinasFiltradas(busqueda).subscribe({
      next: (response: any) => {
        this.listaMaquinas = response;
      },
      error: (error: any) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error.error.message);
          this.authService.eliminarToken();
          this.router.navigate(['/login']);
        } else {
          console.error('Error - No se ha podido obtener las máquinas');
        }
      }
    });
  }

  // Función para manejar la selección de archivos
  selectFile(field: string) {
    const inputElement = document.getElementById(field) as HTMLInputElement;
    inputElement?.click();
  }

  // Función para manejar el archivo seleccionado
  onFileSelected(field: string, event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevaMaquina[field] = file;
    }
  }

  // Función que maneja el envío del formulario
  guardarMaquina(crearMaquinaForm: NgForm) {
    if (crearMaquinaForm.valid) {

      // Comprobamos que todos los campos tienen datos
      if (!this.nuevaMaquina.nombre || !this.nuevaMaquina.fotoMaquina || !this.nuevaMaquina.dificultad || !this.nuevaMaquina.writeUp 
        || !this.nuevaMaquina.imagenMaquina || !this.nuevaMaquina.descripcion || !this.nuevaMaquina.flagUsuario 
        || !this.nuevaMaquina.flagRoot) {

        this.mensajeErrorFormNuevaMaquina = true;
        this.mensajeFormNuevaMaquina = "Todos los campos son obligatorios";

      } else {

        const formData = new FormData();

        // Añadimos los archivos seleccionados al FormData
        if (this.nuevaMaquina.fotoMaquina) {
          formData.append('fotoMaquina', this.nuevaMaquina.fotoMaquina);
        }
        if (this.nuevaMaquina.imagenMaquina) {
          formData.append('imagenMaquina', this.nuevaMaquina.imagenMaquina);
        }
  
        // Añadimos los otros datos del formulario
        formData.append('nombre', this.nuevaMaquina.nombre);
        formData.append('dificultad', this.nuevaMaquina.dificultad);
        formData.append('writeUp', this.nuevaMaquina.writeUp);
        formData.append('descripcion', this.nuevaMaquina.descripcion);
        formData.append('flagUsuario', this.nuevaMaquina.flagUsuario);
        formData.append('flagRoot', this.nuevaMaquina.flagRoot);
  
        console.log(formData);

        // this.servicioMaquina.crearMaquina(formData).subscribe(...);

        // Reiniciamos el formulario
        crearMaquinaForm.reset();
        this.nuevaMaquina.fotoMaquina = null;
        this.nuevaMaquina.imagenMaquina = null;

      }

      setTimeout(() => {
        this.mensajeFormNuevaMaquina = '';
      }, 3000);

    }

  }

}