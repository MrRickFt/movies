import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { AuthService } from '../../../../core/services/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="text-center">
          <mat-icon class="logo-icon">movie</mat-icon>
          <h1 class="app-title">FilmFinder</h1>
          <p class="app-subtitle">Descubre las mejores películas, guarda tus favoritas y mucho más.</p>
        </div>
        
        <mat-divider class="my-4"></mat-divider>
        
        <div class="text-center mt-4">
          <button 
            mat-raised-button 
            color="primary" 
            class="login-button"
            (click)="login()"
          >
            <mat-icon>login</mat-icon>
            Iniciar sesión con Google
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-card {
      max-width: 400px;
      padding: 2rem;
      border-radius: 8px;
    }
    
    .logo-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 1rem;
      color: #3f51b5;
    }
    
    .app-title {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #3f51b5;
    }
    
    .app-subtitle {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 1.5rem;
    }
    
    .login-button {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }
    
    .my-4 {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .mt-4 {
      margin-top: 1.5rem;
    }
    
    .text-center {
      text-align: center;
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  login() {
    this.authService.googleSignIn().subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/movies']);
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
      }
    });
  }
}