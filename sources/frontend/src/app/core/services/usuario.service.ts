import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://192.168.2.2:3000/api';

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

  // Método para obtener el ranking de usuarios
  obtenerRanking(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/ranking`, { headers });
  }

  // Método para obtener los usuarios registrados
  obtenerUsuariosRegistrados(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/usuarios-registrados`, { headers });
  }

  // Método para modificar el rol del usuario
  cambiarRol(idUsuario: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idUsuario', idUsuario);

    return this.http.put(`${this.apiUrl}/cambiar-rol`, {}, { headers, params });
  }

  // Método para eliminar el usuario
  eliminarUsuario(idUsuario: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const params = new HttpParams().set('idUsuario', idUsuario);

    return this.http.delete(`${this.apiUrl}/eliminar-usuario`, { headers, params });
  }

}