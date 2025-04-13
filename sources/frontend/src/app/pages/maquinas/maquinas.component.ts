import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MaquinaService } from '../../core/services/maquina.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-maquinas',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent, CommonModule, FormsModule],
  templateUrl: './maquinas.component.html',
  styleUrls: ['./maquinas.component.css']
})
export class MaquinasComponent {
  sidebarExpandido = true;

  nuevaMaquina: any = { dificultad: "" };
  mensajeFormNuevaMaquina: string = '';
  mensajeErrorFormNuevaMaquina: boolean = false;

  busquedaSubject: Subject<string> = new Subject();
  busqueda = '';
  listaMaquinas: any[] = [];

  constructor(private router: Router, private authService: AuthService, private maquinaService: MaquinaService) { }

  ngOnInit(): void {
    this.comprobarToken();

    // Espera 500ms antes de buscar para evitar peticiones innecesarias
    this.busquedaSubject
      .pipe(debounceTime(500))
      .subscribe((valor: string) => {
        this.getObtenerMaquinas(valor);
      });

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
        this.listaMaquinas = response.maquinasFiltradas;
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

    // Comprobamos que todos los campos tienen datos
    if (!this.nuevaMaquina.nombre || !this.nuevaMaquina.fotoMaquina || !this.nuevaMaquina.dificultad || !this.nuevaMaquina.writeUp
      || !this.nuevaMaquina.imagenMaquina || !this.nuevaMaquina.descripcion || !this.nuevaMaquina.flagUsuario
      || !this.nuevaMaquina.flagRoot) {

      this.mensajeErrorFormNuevaMaquina = true;
      this.mensajeFormNuevaMaquina = "Todos los campos son obligatorios";

    } else {

      const data = new FormData();

      // Añadimos los archivos seleccionados al FormData
      if (this.nuevaMaquina.fotoMaquina) {
        data.append('fotoMaquina', this.nuevaMaquina.fotoMaquina);
      }

      if (this.nuevaMaquina.imagenMaquina) {
        data.append('imagenMaquina', this.nuevaMaquina.imagenMaquina);
      }

      // Añadimos los otros datos del formulario
      data.append('nombre', this.nuevaMaquina.nombre);
      data.append('dificultad', this.nuevaMaquina.dificultad);
      data.append('writeUp', this.nuevaMaquina.writeUp);
      data.append('flagUsuario', this.nuevaMaquina.flagUsuario);
      data.append('flagRoot', this.nuevaMaquina.flagRoot);
      data.append('puntuacion', this.nuevaMaquina.puntuacion);
      data.append('descripcion', this.nuevaMaquina.descripcion);

      // Subimos la nueva máquina
      this.maquinaService.crearMaquina(data).subscribe({
        next: (response: any) => {
          this.mensajeFormNuevaMaquina = response.message;
          this.mensajeErrorFormNuevaMaquina = false;

          // Reiniciamos el formulario
          crearMaquinaForm.reset();
          this.nuevaMaquina.fotoMaquina = null;
          this.nuevaMaquina.imagenMaquina = null;

          setTimeout(() => {
            this.mensajeFormNuevaMaquina = '';
          }, 4000);

        },
        error: (error: any) => {
          this.mensajeFormNuevaMaquina = error.error.message;
          this.mensajeErrorFormNuevaMaquina = true;

          setTimeout(() => {
            this.mensajeFormNuevaMaquina = '';
          }, 4000);

        }
      });
    }
  }

  // Método para esperar que el usuario termine de escribir antes de buscar
  onBusquedaChange(valor: string): void {
    this.busquedaSubject.next(valor);
  }

}