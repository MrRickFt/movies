// src/app/shared/components/nav-header/nav-header.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z6">
      <div class="container">
        <div class="toolbar-row">
          <a mat-button routerLink="/movies" class="logo-link">
            <mat-icon>movie</mat-icon>
            <span class="app-title">FilmFinder</span>
          </a>
          
          <div class="nav-links" [class.hidden]="isHandset">
            <a mat-button routerLink="/movies" routerLinkActive="active-link">
              <mat-icon>theaters</mat-icon> Películas
            </a>
            <a mat-button routerLink="/favorites" routerLinkActive="active-link">
              <mat-icon>favorite</mat-icon> Favoritos
            </a>
          </div>
          
          <span class="spacer"></span>
          
          <div class="search-container">
            <mat-form-field appearance="outline" class="search-field">
              <mat-select [(value)]="searchType" (selectionChange)="onSearchTypeChange()">
                <mat-option value="title">Por Título</mat-option>
                <mat-option value="genre">Por Género</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="search-input-field">
              <mat-icon matPrefix>search</mat-icon>
              <input 
                matInput 
                placeholder="Buscar películas..." 
                [(ngModel)]="searchQuery"
                (keyup.enter)="search()"
              >
              <button 
                mat-icon-button 
                matSuffix 
                *ngIf="searchQuery" 
                (click)="searchQuery = ''"
              >
                <mat-icon>close</mat-icon>
              </button>
            </mat-form-field>
            
            <button mat-raised-button color="accent" (click)="search()">
              Buscar
            </button>
          </div>
          
          <span class="spacer"></span>
          
          <ng-container *ngIf="user$ | async as user">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-trigger">
              <img [src]="user.photoURL" class="user-avatar" alt="Usuario">
              <span class="user-name">{{ user.displayName }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Cerrar sesión</span>
              </button>
            </mat-menu>
          </ng-container>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .toolbar-row {
      display: flex;
      align-items: center;
      width: 100%;
    }
    
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
    }
    
    .app-title {
      margin-left: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .nav-links {
      margin-left: 16px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .search-container {
      display: flex;
      align-items: center;
      max-width: 600px;
      width: 100%;
    }
    
    .search-field {
      width: 120px;
      margin-right: 8px;
    }
    
    .search-input-field {
      flex: 1;
      margin-right: 8px;
    }
    
    .user-menu-trigger {
      display: flex;
      align-items: center;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .user-name {
      margin-right: 4px;
    }
    
    .active-link {
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    @media (max-width: 960px) {
      .search-container {
        max-width: 400px;
      }
    }
    
    @media (max-width: 768px) {
      .hidden {
        display: none;
      }
      
      .search-container {
        max-width: 300px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class NavHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly searchContext = inject(SearchStrategyContex);
  
  user$ = this.authService.user$;
  searchQuery = '';
  searchType = 'title';
  selectedGenreId = 28; // Action genre by default
  isHandset = false; // Idealmente esto se determinaría con un servicio de BreakpointObserver

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión', error);
      }
    });
  }

  onSearchTypeChange() {
    if (this.searchType === 'title') {
      this.searchContext.setStrategy('title');
    } else {
      this.searchContext.setStrategy('genre', this.selectedGenreId);
    }
  }

  search() {
    if (this.searchQuery.trim() || this.searchType === 'genre') {
      this.router.navigate(['/search'], { 
        queryParams: { 
          q: this.searchQuery,
          type: this.searchType,
          genreId: this.searchType === 'genre' ? this.selectedGenreId : null
        } 
      });
    }
  }
}