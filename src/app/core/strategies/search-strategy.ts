import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchStrategy } from '../interfaces/search-strategy';
import { MovieService } from '../services/movies.service';
import { Movie } from '../interfaces/movie';


@Injectable({
    providedIn: 'root'
})
export class SearchStrategyContext {
    private strategy: SearchStrategy;
    private readonly movieService = inject(MovieService);

    constructor() {
        this.strategy = new TitleSearchStrategy(this.movieService);
    }

    setStrategy(strategy: 'title' | 'genre', genreId?: number): void {
        if (strategy === 'title') {
            this.strategy = new TitleSearchStrategy(this.movieService);
        } else if (strategy === 'genre' && genreId) {
            this.strategy = new GenreSearchStrategy(this.movieService, genreId);
        }
    }

    executeSearch(query: string, page: number): Observable<{ results: Movie[], total_results: number }> {
        return this.strategy.search(query, page);
    }
    
}

export class TitleSearchStrategy implements SearchStrategy {
    constructor(private readonly movieService: MovieService) { }

    search(query: string, page: number): Observable<{ results: Movie[], total_results: number }> {
        return this.movieService.searchMoviesByTitle(query, page).pipe(
            map(response => ({
                results: response.results, 
                total_results: response.total_results
            }))
        );
    }
}


export class GenreSearchStrategy implements SearchStrategy {
    constructor(private readonly movieService: MovieService, private readonly genreId: number) { }

    search(_query: string, page: number): Observable<{ results: Movie[], total_results: number }> {
        return this.movieService.searchMoviesByGenre(this.genreId, page).pipe(
            map(response => ({
                results: response.results,
                total_results: response.total_results
            }))
        );
    }
}

