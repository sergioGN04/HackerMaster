import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { ContactoService } from '../../core/services/contacto.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  nombreUsuario: string = '';
  asunto: string = '';
  descripcion: string = '';
  mensajeRespuesta: string = '';
  mensajeEsError: boolean = false;

  constructor(private contactoService: ContactoService) { }

  ngOnInit() {
    this.posicionarArriba();
  }

  posicionarArriba() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 40)
  }

  enviar(event: Event, contactoForm: NgForm) {
    event.preventDefault();

    const { nombreUsuario, asunto, descripcion } = contactoForm.form.value;

    this.contactoService.enviarFormulario(nombreUsuario, asunto, descripcion).subscribe({
      next: (response: any) => {
        this.mensajeRespuesta = response.message;
        this.mensajeEsError = false;
        contactoForm.reset();
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
    }, 5000)

  }
  
}