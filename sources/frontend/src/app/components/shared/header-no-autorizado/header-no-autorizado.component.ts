import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd, } from '@angular/router';

@Component({
  selector: 'app-header-no-autorizado',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header-no-autorizado.component.html',
  styleUrls: ['./header-no-autorizado.component.css']
})
export class HeaderNoAutorizadoComponent implements OnInit {
  rutaActual: string = '';
  seccionActiva: string = '';

  secciones = ['inicio', 'que-es', 'estadisticas', 'quienes-somos'];
  seccionVisible: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.rutaActual = this.router.url;

    if (this.rutaActual.includes('/inicio')) {
      this.seccionActiva = 'inicio';
    } else {
      this.seccionActiva = this.rutaActual.split('/')[1];
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;

        if (this.rutaActual === '/inicio') {
          this.seccionActiva = 'inicio';
        } else {
          this.seccionActiva = '';
        }
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    console.log('Sección activa:', this.seccionActiva);
    for (let seccion of this.secciones) {
      const elemento = document.getElementById(seccion);
      if (elemento) {
        const rect = elemento.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 6 && rect.bottom > window.innerHeight / 6) {
          this.seccionVisible = seccion;
        }
      }
    }

    this.seccionActiva = this.seccionVisible;
  }
}