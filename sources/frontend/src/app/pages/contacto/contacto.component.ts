import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { ContactoService } from '../../core/services/contacto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent, FooterComponent, FormsModule,CommonModule],
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

  enviar(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const nombreUsuario = (document.getElementById('nombreUsuario') as HTMLInputElement).value;
    const asunto = (document.getElementById('asunto') as HTMLSelectElement).value;
    const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;

    this.contactoService.enviarFormulario(nombreUsuario, asunto, descripcion).subscribe({
      next: (response: any) => {
        this.mensajeRespuesta = "¡Mensaje enviado correctamente!";
        this.mensajeEsError = false;
        form.reset();
      },
      error: (error: any) => {
        this.mensajeRespuesta = "Error al enviar el mensaje. Inténtalo de nuevo.";
        this.mensajeEsError = true;
      }
    });
  }

}