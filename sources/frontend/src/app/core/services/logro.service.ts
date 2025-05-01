import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogroService {
  private apiUrl = 'https://192.168.2.2:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener los logros del usuario
  obtenerLogrosUsuario(idUsuario: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idUsuario', idUsuario);

    return this.http.get(`${this.apiUrl}/logros-usuario`, { headers, params });
  }

  // Método para actualizar los logros del usuario, para que no sean nuevos logros
  actualizarLogrosNuevos(idUsuario: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put(`${this.apiUrl}/actualizar-logros-usuario`, { idUsuario }, { headers });
  }

}