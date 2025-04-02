import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombreUsuario: string = '';
  emailUsuario: string = '';
  passwordUsuario: string = '';
  confirmarPassword: string = '';

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

  registrar(event: Event, registerForm: NgForm) {
    event.preventDefault();

    const { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword } = registerForm.form.value;

    this.authService.register(nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword).subscribe({
      next: (response: any) => {
        this.mensajeRespuesta = response.message;
        this.mensajeEsError = false;
        registerForm.reset();
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