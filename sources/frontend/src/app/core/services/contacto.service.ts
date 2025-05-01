import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private url = 'https://192.168.2.2:3000/api';

  constructor(private http: HttpClient) { }

  enviarFormulario(nombreUsuario: string, asunto: string, descripcion: string) {
    return this.http.post(this.url + '/contacto', { nombreUsuario,asunto, descripcion });
  }

}