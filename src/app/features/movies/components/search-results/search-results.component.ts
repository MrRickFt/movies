import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { SearchStrategyContext } from '../../../../core/strategies/search-strategy';
import { MovieService } from '../../../../core/services/movies.service';
import { Movie } from '../../../../core/interfaces/movie';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MaterialModule, MovieCardComponent, MatPaginatorModule],
  templateUrl: './search-results.component.html' ,
  styleUrl: './search-results.component.css' ,
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
  totalItems = 0;
  currentPage = 1;
  pageSize = 20;

  ngOnInit() {
    this.movieService.getGenres().subscribe(genres => {
      this.genres = genres;
  
      this.route.queryParams.pipe(
        tap(params => {
          this.searchQuery = params['q'] || '';
          this.searchType = params['type'] || 'title';
          this.currentPage = Number(params['page']) || 1;
  
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
          return this.searchContext.executeSearch(this.searchQuery, this.currentPage);
        })
      ).subscribe({
        next: (response) => {
          this.movies = response.results;
          this.totalItems = response.total_results;
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
    }).then(() => {
      this.isLoading = true;
      this.searchContext.setStrategy('genre', this.selectedGenreId);
      this.searchContext.executeSearch('', 1).subscribe({
        next: (response) => {
          console.log(response)
          this.movies = response.results;
          this.isLoading = false;
        },
        error: () => {
          this.movies = [];
          this.isLoading = false;
        }
      });
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
    }).then(() => {
        this.isLoading = true;
        this.searchContext.executeSearch(this.searchQuery, this.currentPage).subscribe({
            next: (response) => {
                this.movies = response.results;
                this.totalItems = response.total_results;
                this.isLoading = false;
            },
            error: () => {
                this.movies = [];
                this.isLoading = false;
            }
        });
    });
}

  
  
}