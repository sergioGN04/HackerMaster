import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-autorizado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-autorizado.component.html',
  styleUrls: ['./sidebar-autorizado.component.css']
})
export class SidebarAutorizadoComponent {
  @Input() expandido = true;
}