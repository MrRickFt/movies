import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { Movie } from '../../../../core/interfaces/movie';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MaterialModule, MovieCardComponent],
  template: `
    <div class="container">
      <h1 class="page-title">Mis películas favoritas</h1>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!isLoading && favorites.length === 0" class="no-favorites">
        <mat-icon>mood_bad</mat-icon>
        <p>No tienes películas favoritas</p>
        <button mat-raised-button color="primary" routerLink="/movies">
          Explorar películas
        </button>
      </div>
      
      <div *ngIf="!isLoading && favorites.length > 0" class="favorites-grid">
        <app-movie-card 
          *ngFor="let movie of favorites" 
          [movie]="movie"
          [showRemoveButton]="true"
          (removeFromFavorites)="removeFavorite(movie.id)"
        ></app-movie-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    
    .page-title {
      font-size: 1.75rem;
      font-weight: 500;
      color: #3f51b5;
      margin-bottom: 24px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    
    .no-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      text-align: center;
    }
    
    .no-favorites mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.4);
    }
    
    .no-favorites p {
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 24px;
    }
    
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 599px) {
      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  private readonly favoritesService = inject(FavoritesService);
  
  favorites: Movie[] = [];
  isLoading = true;
  
  ngOnInit() {
    this.loadFavorites();
  }
  
  loadFavorites() {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.isLoading = false;
      }
    });
  }
  
  removeFavorite(movieId: number) {
    this.favoritesService.removeFromFavorites(movieId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(movie => movie.id !== movieId);
      },
      error: (error) => {
        console.error('Error al eliminar favorito:', error);
      }
    });
  }
}