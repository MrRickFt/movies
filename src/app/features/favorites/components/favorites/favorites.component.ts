import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { Movie } from '../../../../core/interfaces/movie';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

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
  
  // Pagination properties
  pageSize = 10;
  currentPage = 0;
  totalMovies = 0;
  pageSizeOptions = [5, 10, 20, 50];
  
  constructor() {
    effect(() => {
      const favoritesMap = this.favoritesService.favorites();
      if (!this.isLoading && this.allMovies.length > 0) {
        // Apply filter to all movies based on favorites map
        const filteredMovies = this.allMovies.filter(movie => 
          favoritesMap.has(movie.id)
        );
        this.totalMovies = filteredMovies.length;
        
        // Apply pagination to filtered movies
        this.updateDisplayedMovies(filteredMovies);
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
        
        // Apply filter to all movies based on favorites map
        const filteredMovies = favorites.filter(movie => 
          favoritesMap.has(movie.id)
        );
        this.totalMovies = filteredMovies.length;
        
        // Apply pagination to filtered movies
        this.updateDisplayedMovies(filteredMovies);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    const favoritesMap = this.favoritesService.favorites();
    const filteredMovies = this.allMovies.filter(movie => 
      favoritesMap.has(movie.id)
    );
    
    this.updateDisplayedMovies(filteredMovies);
  }
  
  private updateDisplayedMovies(filteredMovies: Movie[]) {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedMovies = filteredMovies.slice(startIndex, startIndex + this.pageSize);
  }
}