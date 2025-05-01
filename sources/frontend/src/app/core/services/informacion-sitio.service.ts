import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformacionSitioService {

  private url = 'https://192.168.2.2:3000/api';

  constructor(private http: HttpClient) { }

  // Método para obtener las estadísticas actuales del sitio
  getInformacionSitio() {
    return this.http.get(this.url + '/estadisticas-actuales');
  }

}