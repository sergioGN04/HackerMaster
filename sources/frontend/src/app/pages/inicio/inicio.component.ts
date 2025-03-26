import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';

@Component({
  selector: 'app-inicio',
  imports: [HeaderNoAutorizadoComponent,FooterComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent { }