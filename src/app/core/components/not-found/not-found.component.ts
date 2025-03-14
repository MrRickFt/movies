import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="not-found-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <button mat-raised-button color="primary" routerLink="/movies">Ir a inicio</button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 64px);
      text-align: center;
      padding: 0 16px;
    }
    
    .error-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      color: #f44336;
      margin-bottom: 16px;
    }
    
    h1 {
      font-size: 4rem;
      margin: 0;
      color: #3f51b5;
    }
    
    h2 {
      font-size: 2rem;
      margin: 8px 0 24px;
      color: #555;
    }
    
    p {
      font-size: 1.2rem;
      margin-bottom: 32px;
      color: #777;
      max-width: 500px;
    }
  `]
})
export class NotFoundComponent {}