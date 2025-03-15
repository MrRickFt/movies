import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { Movie } from '../../../../core/interfaces/movie';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MaterialModule, MovieCardComponent, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  private readonly favoritesService = inject(FavoritesService);
  
  isLoading = true;
  allMovies: Movie[] = [];
  displayedMovies: Movie[] = [];
  
  constructor() {
    effect(() => {
      const favoritesMap = this.favoritesService.favorites();
      if (!this.isLoading && this.allMovies.length > 0) {
        this.displayedMovies = this.allMovies.filter(movie => 
          favoritesMap.has(movie.id)
        );
      }
    });
  }
  
  ngOnInit() {
    this.loadFavorites();
  }
  
  loadFavorites() {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        this.allMovies = favorites;
        const favoritesMap = this.favoritesService.favorites();
        this.displayedMovies = favorites.filter(movie => 
          favoritesMap.has(movie.id)
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.isLoading = false;
      }
    });
  }
}