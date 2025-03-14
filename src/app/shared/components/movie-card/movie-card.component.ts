import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { Observable } from 'rxjs';
import { Movie } from '../../../core/interfaces/movie';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <mat-card class="movie-card mat-elevation-z2">
      <div class="poster-container">
        <img 
          mat-card-image
          [src]="movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : '/assets/no-poster.jpg'" 
          [alt]="movie.title"
          class="movie-poster"
        >
        <div class="rating-badge" [ngClass]="getRatingClass(movie.vote_average)">
          {{ movie.vote_average | number:'1.1-1' }}
        </div>
      </div>
      
      <mat-card-content>
        <h3 class="movie-title">{{ movie.title }}</h3>
        <p class="movie-release-date">{{ movie.release_date | date:'yyyy' }}</p>
      </mat-card-content>
      
      <mat-card-actions>
        <button 
          mat-icon-button 
          color="warn"
          [matTooltip]="(isFavorite$ | async) ? 'Quitar de favoritos' : 'Añadir a favoritos'"
          (click)="toggleFavorite($event)"
        >
          <mat-icon>{{ (isFavorite$ | async) ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
        
        <button 
          mat-button 
          color="primary"
          [routerLink]="['/movie', movie.id]"
        >
          DETALLES
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .movie-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease;
    }
    
    .movie-card:hover {
      transform: translateY(-5px);
    }
    
    .poster-container {
      position: relative;
    }
    
    .movie-poster {
      height: 300px;
      object-fit: cover;
    }
    
    .rating-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: white;
    }
    
    .rating-high {
      background-color: #4CAF50;
    }
    
    .rating-medium {
      background-color: #FF9800;
    }
    
    .rating-low {
      background-color: #F44336;
    }
    
    .movie-title {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .movie-release-date {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 0;
    }
    
    mat-card-content {
      flex-grow: 1;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 0 8px 8px;
    }
  `]
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  
  private readonly favoritesService = inject(FavoritesService);
  
  isFavorite$!: Observable<boolean>;
  
  ngOnInit() {
    this.isFavorite$ = this.favoritesService.isFavorite(this.movie.id);
  }
  
  getRatingClass(rating: number): string {
    if (rating >= 7) return 'rating-high';
    if (rating >= 5) return 'rating-medium';
    return 'rating-low';
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation();
    
    this.isFavorite$.subscribe(isFavorite => {
      if (isFavorite) {
        this.favoritesService.removeFromFavorites(this.movie.id).subscribe();
      } else {
        this.favoritesService.addToFavorites(this.movie).subscribe();
      }
    });
  }
}