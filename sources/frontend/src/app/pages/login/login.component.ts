import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent,FooterComponent,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailUsuario: string = '';
  password: string = '';

  mensajeRespuesta: string = '';
  mensajeEsError: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.posicionarArriba();
    this.redirigirDashboard();
  }

  // Método para posicionar la página arriba
  posicionarArriba() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 40);
  }

  // Método para redirigir al dashboard si el usuario ya está logueado
  redirigirDashboard() {
    if (this.authService.estaLogueado()) {
      setTimeout(() => {
        window.location.href = "/dashboard-usuario";
      }, 500)
    }
  }

  // Método para iniciar sesión
  iniciarSesion(event: Event, registerForm: NgForm) {
    event.preventDefault();

    const { emailUsuario, password } = registerForm.form.value;

    this.authService.login(emailUsuario, password).subscribe({
      next: (response: any) => {

        this.mensajeRespuesta = response.message;
        this.mensajeEsError = false;
        registerForm.reset();

        // Guardamos el token en el localStorage
        this.authService.almacenarToken(response.token);

        // Redireccionamos a la pagina Dashboard-Usuario
        setTimeout(() => {
          window.location.href = "/dashboard-usuario";
        }, 500)

      },
      error: (error: any) => {

        if (error.error && error.error.message) {
          this.mensajeRespuesta = error.error.message;
        } else {
          this.mensajeRespuesta = 'Ocurrió un error inesperado. Intentelo más tarde.';
        }
        this.mensajeEsError = true;

      }
    });

    setTimeout(() => {
      this.mensajeRespuesta = '';
    }, 2500);

  }
  
}