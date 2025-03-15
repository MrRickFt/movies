import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieService } from '../services/movies.service';
import { MovieFactory } from '../interfaces/movie-factory';
import { Movie } from '../interfaces/movie';

@Injectable({
    providedIn: 'root',
})
export class MovieFactoryService {
    private readonly movieService = inject(MovieService);

    getFactory(type: 'popular' | 'nowPlaying' | 'topRated'): MovieFactory {
        switch (type) {
            case 'popular':
                return new PopularMoviesFactory(this.movieService);
            case 'nowPlaying':
                return new NowPlayingMoviesFactory(this.movieService);
            case 'topRated':
                return new TopRatedMoviesFactory(this.movieService);
            default:
                return new PopularMoviesFactory(this.movieService);
        }
    }
}

export class PopularMoviesFactory implements MovieFactory {
    constructor(private readonly movieService: MovieService) { }
    
    getMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
      return this.movieService.getPopularMovies(page);
    }
  }
  
  // Similarly for NowPlayingMoviesFactory and TopRatedMoviesFactory
  export class NowPlayingMoviesFactory implements MovieFactory {
    constructor(private readonly movieService: MovieService) { }
    
    getMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
      return this.movieService.getNowPlayingMovies(page);
    }
  }
  
  export class TopRatedMoviesFactory implements MovieFactory {
    constructor(private readonly movieService: MovieService) { }
    
    getMovies(page: number = 1): Observable<{results: Movie[], totalPages: number}> {
      return this.movieService.getTopRatedMovies(page);
    }
  }
