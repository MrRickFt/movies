import { Component, inject, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  ngOnInit(): void {
    const img = new Image();
    img.src = 'assets/images/movie-backdrop.jpg';
  }
  
  async loginWithGoogle() {
    try {
      await lastValueFrom(this.authService.googleSignIn());
      this.router.navigate(['/movies']);
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
}