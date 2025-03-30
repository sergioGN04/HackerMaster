import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { InformacionSitioService } from '../../core/services/informacion-sitio.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent, FooterComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  estadisticas: any = {};

  constructor(private informacionSitioService: InformacionSitioService, private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getInformacionSitio();
  };

  getInformacionSitio() {
    this.informacionSitioService.getInformacionSitio().subscribe({
      next: (response: any) => {
        this.estadisticas = response;
      },
      error: (error: any) => {
        console.error('Error al obtener las estadísticas:', error);
      }
    });
  }

}