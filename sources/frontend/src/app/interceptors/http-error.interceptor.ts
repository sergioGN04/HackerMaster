import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Permite interceptar la respuesta de las peticiones y manejar errores si es necesario
  return next(req).pipe(
    catchError((error) => {
      // Si el error es 429 (Too Many Requests), redirige a la página de límite excedido
      if (error.status === 429) {
        router.navigate(['/limite-excedido']);
      }

      // Si no es un error 429, enviar el error para que se pueda manejar en otro lugar
      return throwError(() => error);
    })
  );
};