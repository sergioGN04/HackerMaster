import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL del backend
  private url = 'https://192.168.2.2:3000/api';

  constructor(private http: HttpClient) { }

  // Métodos para el registro y login de usuarios
  register(nombreUsuario: string, emailUsuario: string, passwordUsuario: string, confirmarPassword: string) {
    return this.http.post(`${this.url}/register`, { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword });
  }

  login(emailUsuario: string, password: string) {
    return this.http.post(`${this.url}/login`, { emailUsuario, password });
  }

  // Método para verificar si el usuario está logueado
  estaLogueado(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Métodos para almacenar, eliminar y obtener el token de autenticación
  almacenarToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  eliminarToken() {
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

}