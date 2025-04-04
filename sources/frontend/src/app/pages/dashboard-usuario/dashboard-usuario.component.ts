import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';
import { SidebarAutorizadoComponent } from '../../components/shared/sidebar-autorizado/sidebar-autorizado.component';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [HeaderAutorizadoComponent,SidebarAutorizadoComponent],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css'
})
export class DashboardUsuarioComponent {
  sidebarExpandido = true;

  toggleSidebar() {
    this.sidebarExpandido = !this.sidebarExpandido;
  }
  
}