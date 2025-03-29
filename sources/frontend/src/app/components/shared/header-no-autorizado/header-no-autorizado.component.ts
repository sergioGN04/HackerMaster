import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

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
  
  // Método que se encarga de obtener la ruta actual y la sección activa al iniciar el componente
  ngOnInit() {
    this.rutaActual = this.router.url;

    if (this.rutaActual.includes('/inicio')) {
      const fragmento = window.location.hash.substring(1);
      this.seccionActiva = fragmento ? fragmento : 'inicio';
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;

        if (this.rutaActual.startsWith('/inicio')) {
          const fragmento = window.location.hash.substring(1);
          this.seccionActiva = fragmento ? fragmento : 'inicio';
        } else {
          this.seccionActiva = '';
        }
      }
    });
  }

  // Método para manejar el desplazamiento de la ventana
  @HostListener('window:scroll', [])
  onScroll(): void {
    for (let seccion of this.secciones) {
      const elemento = document.getElementById(seccion);
      if (elemento) {
        const rect = elemento.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 6 && rect.bottom > window.innerHeight / 6) {
          this.seccionVisible = seccion;
        }

      }
    }

    if (this.seccionActiva !== this.seccionVisible) {
      this.seccionActiva = this.seccionVisible;

      history.pushState(null, '', `/inicio#${this.seccionActiva}`);
    }
  }

  // Método para manejar el clic en los enlaces del menú
  @HostListener('click', ['$event'])
  onLinkClick(event: Event) {
    const target = event.target as HTMLAnchorElement;
    const currentRoute = this.router.url;

    if (target && target.tagName === 'A') {
      if (target.hash && currentRoute.includes('/inicio')) {
        event.preventDefault();
        const targetId = target.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });

          history.pushState(null, '', `${currentRoute.split('#')[0]}#${targetId}`);
        }
      }
    }
  }

}