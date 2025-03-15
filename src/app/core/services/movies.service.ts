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

  getPopularMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
    return this.http.get<{results: Movie[], total_pages: number, total_results: number}>(
      `${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${page}`
    ).pipe(
      map(response => ({
        results: response.results,
        totalPages: response.total_pages
      })),
      catchError(error => {
        console.error('Error fetching popular movies', error);
        return of({results: [], totalPages: 0});
      })
    );
  }
  
   getNowPlayingMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
    return this.http.get<{results: Movie[], total_pages: number, total_results: number}>(
      `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&language=es-ES&page=${page}`
    ).pipe(
      map(response => ({
        results: response.results,
        totalPages: response.total_pages
      })),
      catchError(error => {
        console.error('Error fetching now playing movies', error);
        return of({results: [], totalPages: 0});
      })
    );
  }
  
  getTopRatedMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
    return this.http.get<{results: Movie[], total_pages: number, total_results: number}>(
      `${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=es-ES&page=${page}`
    ).pipe(
      map(response => ({
        results: response.results,
        totalPages: response.total_pages
      })),
      catchError(error => {
        console.error('Error fetching top rated movies', error);
        return of({results: [], totalPages: 0});
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

  searchMoviesByTitle(query: string, page: number): Observable<{ results: Movie[], total_results: number }> {
    return this.http.get<{ results: Movie[], total_results: number }>(
        `${this.apiUrl}/search/movie?query=${query}&page=${page}&api_key=${this.apiKey}`
    );
}

searchMoviesByGenre(genreId: number, page: number): Observable<{ results: Movie[], total_results: number }> {
    return this.http.get<{ results: Movie[], total_results: number }>(
        `${this.apiUrl}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${this.apiKey}`
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