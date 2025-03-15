import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * Observable que emite el estado actual de carga
   */
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  /**
   * Mostrar el indicador de carga
   */
  show(): void {
    this.loadingSubject.next(true);
  }
  
  /**
   * Ocultar el indicador de carga
   */
  hide(): void {
    this.loadingSubject.next(false);
  }
}