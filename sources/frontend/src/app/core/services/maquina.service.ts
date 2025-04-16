import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService {
  private apiUrl = 'http://192.168.2.2:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener las máquinas recomendadas del usuario
  obtenerMaquinasRecomendadas(rango: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('rango', rango);

    return this.http.get(`${this.apiUrl}/maquinas-recomendadas`, { headers, params });
  }

  // Método para obtener las máquinas en progreso del usuario
  obtenerMaquinasEnProgreso(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/maquinas-en-progreso`, { headers });
  }

  // Método para obtener las máquinas filtradas por el buscador
  obtenerMaquinasFiltradas(busqueda: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('nombreMaquina', busqueda);

    return this.http.get(`${this.apiUrl}/obtener-maquinas-filtradas`, { headers, params });
  }

  // Método para que el usuario pueda subir una máquina
  crearMaquina(data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/crear-maquina`, data, { headers });
  }

  // Método para obtener los detalles de una máquina en especifico
  obtenerDetallesMaquina(idMaquina: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idMaquina', idMaquina);

    return this.http.get(`${this.apiUrl}/maquina-detalle`, { headers, params });
  }

  // Método para desplegar la máquina
  desplegarMaquina(idMaquina: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/desplegar-maquina`, { idMaquina }, { headers });
  }

  // Método para detener la máquina desplegada
  detenerMaquina(idMaquina: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/detener-maquina`, { idMaquina }, { headers });
  }

  // Método para comprobar las flags introducidas
  verificarFlags(idMaquina: string, payload: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const body = { idMaquina, ...payload };

    return this.http.post(`${this.apiUrl}/verificar-flags`, body, { headers });
  }

}