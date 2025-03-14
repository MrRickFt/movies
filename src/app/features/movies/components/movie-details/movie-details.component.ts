import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieService } from '../../../../core/services/movies.service';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MovieDetails } from '../../../../core/interfaces/movie-details';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="container" *ngIf="movie$ | async as movie; else loading">
      <div class="backdrop" [style.background-image]="'url(' + getBackdropUrl(movie.poster_path) + ')'">
        <div class="backdrop-overlay"></div>
      </div>
      
      <div class="content">
        <div class="poster-container">
          <img [src]="getPosterUrl(movie.poster_path)" [alt]="movie.title" class="poster">
          
          <div class="actions">
            <button mat-raised-button color="primary" (click)="toggleFavorite(movie)" *ngIf="isLoggedIn$ | async">
              <mat-icon>{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
              {{ isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
            </button>
            
            <a mat-raised-button color="accent" [href]="'https://www.youtube.com/results?search_query=' + movie.title + ' trailer'" target="_blank">
              <mat-icon>play_circle</mat-icon>
              Ver trailer
            </a>
          </div>
        </div>
        
        <div class="details">
          <h1 class="title">{{ movie.title }} <span class="year" *ngIf="movie.release_date">({{ movie.release_date | date:'yyyy' }})</span></h1>
          
          <div class="meta">
            <div class="rating">
              <mat-icon class="star">star</mat-icon>
              <span>{{ movie.vote_average | number:'1.1-1' }}/10</span>
            </div>
            
            <div class="runtime" *ngIf="movie.runtime">
              <mat-icon>schedule</mat-icon>
              <span>{{ formatRuntime(movie.runtime) }}</span>
            </div>
          </div>
          
          <div class="genres">
            <span class="genre-tag" *ngFor="let genre of movie.genres">{{ genre.name }}</span>
          </div>
          
          <div class="overview">
            <h2>Sinopsis</h2>
            <p>{{ movie.overview || 'No hay sinopsis disponible para esta película.' }}</p>
          </div>
          
          <div class="additional-info" *ngIf="movie.release_date || movie.title">
            <h2>Información adicional</h2>
            <ul>
              <li *ngIf="movie.release_date">
                <strong>Fecha de estreno:</strong> {{ movie.release_date | date:'dd/MM/yyyy' }}
              </li>
              <li *ngIf="movie.title && movie.title !== movie.title">
                <strong>Título original:</strong> {{ movie.title }}
              </li>
              <li *ngIf="movie.production_companies && movie.production_companies.length > 0">
                <strong>País:</strong> {{ movie.production_companies[0].name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    .container {
      position: relative;
      min-height: calc(100vh - 64px);
    }
    
    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center top;
      filter: blur(10px);
      transform: scale(1.05);
    }
    
    .backdrop-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%);
    }
    
    .content {
      position: relative;
      z-index: 1;
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 16px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    }
    
    .poster-container {
      flex: 0 0 300px;
      margin-right: 48px;
    }
    
    .poster {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    
    .actions {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .details {
      flex: 1;
      color: white;
    }
    
    .title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .year {
      font-weight: 400;
      opacity: 0.7;
    }
    
    .meta {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .rating, .runtime {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
    
    .rating .star {
      color: #FFD700;
      margin-right: 4px;
    }
    
    .runtime mat-icon {
      margin-right: 4px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    
    .genre-tag {
      background-color: rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 4px 12px;
      font-size: 0.9rem;
    }
    
    .overview h2, .additional-info h2 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      font-weight: 500;
    }
    
    .overview p {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    
    .additional-info ul {
      list-style: none;
      padding: 0;
    }
    
    .additional-info li {
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .content {
        flex-direction: column;
        padding: 24px 16px;
      }
      
      .poster-container {
        margin-right: 0;
        margin-bottom: 32px;
        flex: 0 0 auto;
        max-width: 300px;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly authService = inject(AuthService);
  
  movie$!: Observable<MovieDetails | null>;
  isFavorite = false;
  isLoggedIn$ = this.authService.user$.pipe(map(user => !!user));
  
  ngOnInit() {
    this.movie$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) {
          this.router.navigate(['/movies']);
          return of(null);
        }
        return this.movieService.getMovieDetails(parseInt(id)).pipe(
          tap(movie => {
            if (movie && this.authService.user$) {
              this.checkIfFavorite(movie.id);
            }
          }),
          catchError(error => {
            console.error('Error al obtener detalles de la película:', error);
            this.router.navigate(['/movies']);
            return of(null);
          })
        );
      })
    );
  }
  
  getPosterUrl(posterPath: string | null): string {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return 'assets/images/no-poster.jpg';
  }
  
  getBackdropUrl(backdropPath: string | null): string {
    if (backdropPath) {
      return `https://image.tmdb.org/t/p/original${backdropPath}`;
    }
    return 'assets/images/no-backdrop.jpg';
  }
  
  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }
  
  checkIfFavorite(movieId: number) {
    this.favoritesService.isFavorite(movieId).subscribe(isFav => {
      this.isFavorite = isFav;
    });
  }
  
  toggleFavorite(movie: MovieDetails) {
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(movie.id).subscribe(() => {
        this.isFavorite = false;
      });
    } else {
      this.favoritesService.addToFavorites(movie).subscribe(() => {
        this.isFavorite = true;
      });
    }
  }
}