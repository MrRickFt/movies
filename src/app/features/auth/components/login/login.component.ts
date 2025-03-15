// src/app/features/auth/login.component.ts
import { Component, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <mat-icon class="logo-icon">movie</mat-icon>
          <h1 class="app-title">MovieApp</h1>
          <p class="app-subtitle">Tu plataforma de películas favoritas</p>
        </div>
        
        <div class="login-content">
          <h2>Iniciar sesión</h2>
          <p class="login-description">Accede a tu cuenta para guardar tus películas favoritas y más.</p>
          
          <div class="login-providers">
            <button mat-raised-button class="google-btn" (click)="loginWithGoogle()">
              <img src="assets/images/google-logo.svg" alt="Google" class="provider-icon">
              <span>Continuar con Google</span>
            </button>
          </div>
          
          <div class="login-footer">
            <p>Al iniciar sesión, aceptas nuestros <a href="#">Términos de servicio</a> y <a href="#">Política de privacidad</a>.</p>
          </div>
        </div>
        
        <div class="login-backdrop">
          <img src="assets/images/movie-backdrop.jpg" alt="Movies backdrop" class="backdrop-image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background-color: #f5f5f5;
    }
    
    .login-card {
      display: flex;
      position: relative;
      width: 100%;
      max-width: 900px;
      min-height: 500px;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .logo-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #3f51b5;
      margin-bottom: 16px;
    }
    
    .app-title {
      font-size: 2rem;
      font-weight: 500;
      color: #3f51b5;
      margin: 0;
    }
    
    .app-subtitle {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 8px;
    }
    
    .login-content {
      flex: 1;
      padding: 48px;
      z-index: 10;
    }
    
    .login-description {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 32px;
    }
    
    .login-providers {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      background-color: white;
      border: 1px solid #ddd;
      color: rgba(0, 0, 0, 0.87);
      transition: background-color 0.3s;
      border-radius: 24px;
    }
    
    .google-btn:hover {
      background-color: #f8f8f8;
    }
    
    .provider-icon {
      height: 24px;
      margin-right: 12px;
    }
    
    .login-footer {
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.54);
      margin-top: auto;
    }
    
    .login-footer a {
      color: #3f51b5;
      text-decoration: none;
    }
    
    .login-backdrop {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .backdrop-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    @media (max-width: 768px) {
      .login-backdrop {
        display: none;
      }
      
      .login-card {
        max-width: 400px;
      }
    }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  async loginWithGoogle() {
    try {
      await lastValueFrom(this.authService.googleSignIn());
      this.router.navigate(['/movies']);
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
  
}