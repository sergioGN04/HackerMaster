import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://192.168.2.2:3000/api';

  constructor(private http: HttpClient) { }

  register(nombreUsuario: string, emailUsuario: string, passwordUsuario: string, confirmarPassword: string) {
    return this.http.post(`${this.url}/register`, { nombreUsuario, emailUsuario, passwordUsuario, confirmarPassword });
  }

  iniciarSesion(emailUsuario: string, password: string) {
    return this.http.post(`${this.url}/login`, { emailUsuario, password });
  }

}