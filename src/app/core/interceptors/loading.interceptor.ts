// src/app/core/interceptors/loading.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, finalize, catchError, throwError } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);
  private readonly snackBar = inject(MatSnackBar);
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // No mostrar loading para algunas peticiones (opcional)
    const skipLoading = request.headers.has('x-skip-loading');
    
    if (!skipLoading) {
      this.loadingService.show();
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo de errores HTTP
        let errorMessage = 'Ocurrió un error en la solicitud';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 401:
              errorMessage = 'No tienes autorización para acceder a este recurso';
              break;
            case 403:
              errorMessage = 'Acceso prohibido';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText}`;
              break;
          }
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        
        return throwError(() => error);
      }),
      finalize(() => {
        if (!skipLoading) {
          this.loadingService.hide();
        }
      })
    );
  }
}