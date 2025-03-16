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
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
  
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