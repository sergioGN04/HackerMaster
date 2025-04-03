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
  }

  posicionarArriba() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 40);
  }

  iniciarSesion(event: Event, registerForm: NgForm) {
    event.preventDefault();

    const { emailUsuario, password } = registerForm.form.value;

    this.authService.iniciarSesion(emailUsuario, password).subscribe({
      next: (response: any) => {

        this.mensajeRespuesta = response.message;
        this.mensajeEsError = false;
        registerForm.reset();

        // Guardamos el token en el localStorage
        localStorage.setItem('authToken', response.token);

        // Redireccionamos a la pagina Dashboard Usuario
        setTimeout(() => {
          window.location.href = "/dashboard-usuario";
        }, 1500)

      },
      error: (error: any) => {

        if (error.error && error.error.message) {
          this.mensajeRespuesta = error.error.message;
        } else {
          this.mensajeRespuesta = 'Ocurrió un error inesperado. Intenta nuevamente.';
        }
        this.mensajeEsError = true;

      }
    });

    setTimeout(() => {
      this.mensajeRespuesta = '';
    }, 3000);

  }
  
}