import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://192.168.2.2:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener el resumen del usuario
  obtenerResumenUsuario(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/dashboard-usuario`, { headers });
  }

  // Método para obtener la información del usuario
  obtenerInformacionUsuario(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/informacion-usuario`, { headers });
  }

  // Método para actualizar la foto de perfil
  actualizarFotoPerfil(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/actualizar-imagen-perfil`, formData, { headers });
  }

  // Método para actualizar los datos de usuario
  actualizarUsuario(usuario: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.put(`${this.apiUrl}/actualizar-datos-usuario`, usuario, { headers });
  }

  // Método para actualizar la contraseña del usuario
  actualizarPassword(data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/actualizar-password`, data, { headers });
  }

  // Método para comprobar las flags introducidas
  obtenerRanking(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/ranking`, { headers });
  }

}