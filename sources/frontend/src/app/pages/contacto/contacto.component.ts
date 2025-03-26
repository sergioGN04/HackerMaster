import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';

@Component({
  selector: 'app-contacto',
  imports: [HeaderNoAutorizadoComponent,FooterComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent { }