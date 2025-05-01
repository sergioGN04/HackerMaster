import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-limite-excedido',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent, RouterLink],
  templateUrl: './limite-excedido.component.html',
  styleUrl: './limite-excedido.component.css',
})
export class LimiteExcedidoComponent { }