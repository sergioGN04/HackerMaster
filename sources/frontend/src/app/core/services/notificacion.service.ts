import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl = 'http://192.168.2.2:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener las notificaciones del usuario que no han sido leídas
  obtenerNotificacionesUsuario(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/notificaciones-usuario`, { headers });
  }

  // Método para marcar notificaciones como vistas
  marcarNotificaciones(notificaciones: any[]): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put(`${this.apiUrl}/marcar-notificaciones`, { notificaciones }, { headers });
  }

  // Método para obtener las notificaciones
  obtenerNotificaciones(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/notificaciones`, { headers });
  }

  // Método para crear la notificación
  crearNotificacion(data: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/crear-notificacion`, data, { headers });
  }

  // Método para eliminar una notificación
  eliminarNotificacion(idNotificacion: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idNotificacion', idNotificacion);

    return this.http.delete(`${this.apiUrl}/eliminar-notificacion`, { headers, params });
  }

}