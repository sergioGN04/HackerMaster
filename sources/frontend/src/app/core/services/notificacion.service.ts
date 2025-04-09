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

    return this.http.get(`${this.apiUrl}/notificaciones`, { headers });
  }

  // Método para obtener las notificaciones del usuario que no han sido leídas
  marcarNotificaciones(notificaciones: any[]): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const idsNotificaciones = notificaciones.join(",");
    const params = new HttpParams().set('idsNotificaciones',idsNotificaciones);

    return this.http.get(`${this.apiUrl}/marcar-notificaciones`, { headers, params });
  }

}