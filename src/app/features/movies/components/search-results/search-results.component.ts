import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { SearchStrategyContext } from '../../../../core/strategies/search-strategy';
import { MovieService } from '../../../../core/services/movies.service';
import { Movie } from '../../../../core/interfaces/movie';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MaterialModule, MovieCardComponent],
  template: `
    <div class="container">
      <div class="search-header">
        <h1 class="page-title">
          {{ searchType === 'title' ? 'Resultados para: ' + searchQuery : 'Películas de género: ' + selectedGenreName }}
        </h1>
        
        <div *ngIf="searchType === 'genre'" class="genre-filters">
          <mat-form-field appearance="outline">
            <mat-label>Filtrar por género</mat-label>
            <mat-select [(value)]="selectedGenreId" (selectionChange)="onGenreChange()">
              <mat-option *ngFor="let genre of genres" [value]="genre.id">
                {{ genre.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!isLoading && movies.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <p>No se encontraron resultados</p>
        <button mat-raised-button color="primary" routerLink="/movies">
          Ver todas las películas
        </button>
      </div>
      
      <div *ngIf="!isLoading && movies.length > 0" class="movie-grid">
        <app-movie-card 
          *ngFor="let movie of movies" 
          [movie]="movie"
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
    
    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .page-title {
      font-size: 1.75rem;
      font-weight: 500;
      color: #3f51b5;
      margin: 0;
    }
    
    .genre-filters {
      min-width: 250px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    
    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      text-align: center;
    }
    
    .no-results mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.4);
    }
    
    .no-results p {
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 24px;
    }
    
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 599px) {
      .search-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchContext = inject(SearchStrategyContext);
  private readonly movieService = inject(MovieService);
  
  movies: Movie[] = [];
  searchQuery = '';
  searchType: 'title' | 'genre' = 'title';
  selectedGenreId = 28;
  selectedGenreName = '';
  genres: {id: number, name: string}[] = [];
  isLoading = true;
  
  ngOnInit() {
    this.movieService.getGenres().subscribe(genres => {
      this.genres = genres;
      
      this.route.queryParams.pipe(
        tap(params => {
          this.searchQuery = params['q'] || '';
          this.searchType = params['type'] || 'title';
          
          if (this.searchType === 'genre') {
            this.selectedGenreId = Number(params['genreId']) || 28;
            const genre = this.genres.find(g => g.id === this.selectedGenreId);
            this.selectedGenreName = genre?.name ?? 'Acción';
          }
        }),
        switchMap(() => {
          this.isLoading = true;
          this.searchContext.setStrategy(
            this.searchType, 
            this.searchType === 'genre' ? this.selectedGenreId : undefined
          );
          return this.searchContext.executeSearch(this.searchQuery);
        })
      ).subscribe({
        next: (movies) => {
          this.movies = movies;
          this.isLoading = false;
        },
        error: () => {
          this.movies = [];
          this.isLoading = false;
        }
      });
    });
  }

  onGenreChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: 'genre',
        genreId: this.selectedGenreId
      },
      queryParamsHandling: 'merge'
    });
  }
}