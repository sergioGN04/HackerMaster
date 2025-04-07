import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderAutorizadoComponent, SidebarAutorizadoComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  sidebarExpandido = true;
}