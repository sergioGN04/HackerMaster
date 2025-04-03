import { Component } from '@angular/core';
import { HeaderAutorizadoComponent } from '../../components/shared/header-autorizado/header-autorizado.component';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [HeaderAutorizadoComponent],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css'
})
export class DashboardUsuarioComponent {

}
