import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie } from '../interfaces/movie';
import { MovieDetails } from '../interfaces/movie-details';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.tmdbApi.baseUrl;
  private readonly apiKey = environment.tmdbApi.apiKey;

  constructor() {}

  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<{results: Movie[]}>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching popular movies', error);
          return of([]);
        })
      );
  }

  getNowPlayingMovies(): Observable<Movie[]> {
    return this.http.get<{results: Movie[]}>(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching now playing movies', error);
          return of([]);
        })
      );
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.http.get<{results: Movie[]}>(`${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error fetching top rated movies', error);
          return of([]);
        })
      );
  }

  getMovieDetails(id: number): Observable<MovieDetails | null> {
    return this.http.get<MovieDetails>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching movie details for movie ${id}`, error);
          return of(null);
        })
      );
  }

  searchMoviesByTitle(query: string): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]);
    }
    
    return this.http.get<{results: Movie[]}>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=es-ES&query=${query}`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error searching movies by title', error);
          return of([]);
        })
      );
  }

  searchMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.http.get<{results: Movie[]}>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&language=es-ES&with_genres=${genreId}`)
      .pipe(
        map(response => response.results),
        catchError(error => {
          console.error('Error searching movies by genre', error);
          return of([]);
        })
      );
  }

  getGenres(): Observable<{id: number, name: string}[]> {
    return this.http.get<{genres: {id: number, name: string}[]}>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map(response => response.genres),
        catchError(error => {
          console.error('Error fetching genres', error);
          return of([]);
        })
      );
  }
}