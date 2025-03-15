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

    executeSearch(query: string): Observable<Movie[]> {
        return this.strategy.search(query);
    }
}

export class TitleSearchStrategy implements SearchStrategy {
    constructor(private readonly movieService: MovieService) { }

    search(query: string): Observable<Movie[]> {
        return this.movieService.searchMoviesByTitle(query).pipe(
            map((response) => response.results)
        );
    }
}

export class GenreSearchStrategy implements SearchStrategy {
    constructor(private readonly movieService: MovieService, private readonly genreId: number) { }

    search(_query: string): Observable<Movie[]> {
        return this.movieService.searchMoviesByGenre(this.genreId);
    }
}