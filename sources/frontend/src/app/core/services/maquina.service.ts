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

}