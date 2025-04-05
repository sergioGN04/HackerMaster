import { Component } from '@angular/core';
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
  expandido = true;
  logoUrl: string = '/assets/images/hackermasterlogo.png';

  onLogoClick(): void {
    this.expandido = !this.expandido;

    if (this.expandido) {
      this.logoUrl = '/assets/images/hackermasterlogo.png';
    } else {
      this.logoUrl = '/assets/images/logo.png';
    }
    
  }
  
}