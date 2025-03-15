import { Component, OnInit, Injectable, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

import { MaterialModule } from '../../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../core/interfaces/movie';
import { SearchStrategyContext } from '../../../../core/strategies/search-strategy';
import { MovieService } from '../../../../core/services/movies.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
 private readonly searchStrategyContext = inject(SearchStrategyContext);
 private readonly moviesService = inject(MovieService)

  searchControl = new FormControl('');
  searchMethod: 'title' | 'genre' = 'title';
  genres$ = this.moviesService.getGenres();
  filteredOptions!: Observable<string[]>;
  movies: Movie[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 20;
  selectedGenreId?: number;

  constructor(
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string | null) =>
        this.searchStrategyContext.executeSearch(query || '', this.currentPage).pipe(
          map(response => response.results.map(movie => movie.title))
        )
      )
    );
  }
  
  
  

  searchMethodChanged(method: 'title' | 'genre'): void {
    this.searchMethod = method;
    this.movies = [];
    this.totalItems = 0;
    this.currentPage = 1;
    if (method === 'genre') {
      this.searchControl.setValue('');
    }
  }

  genreSelected(genreId: number): void {
    this.selectedGenreId = genreId;
    this.currentPage = 1;
    this.fetchMovies();
  }

  optionSelected(title: string): void {
    this.searchControl.setValue(title);
    this.fetchMovies();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.movies = [];
    this.totalItems = 0;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchMovies();
  }

  private fetchMovies(): void {
    if (this.searchMethod === 'title') {
      this.searchStrategyContext.setStrategy('title');
      this.searchStrategyContext.executeSearch(this.searchControl.value?? '', this.currentPage)
        .subscribe((response: { results: Movie[], total_results: number }) => {
          this.movies = response.results;
          this.totalItems = response.total_results;
        });
    } else if (this.searchMethod === 'genre' && this.selectedGenreId) {
      this.searchStrategyContext.setStrategy('genre', this.selectedGenreId);
      this.searchStrategyContext.executeSearch('', this.currentPage)
        .subscribe((response: { results: Movie[], total_results: number }) => {
          this.movies = response.results;
          this.totalItems = response.total_results;
        });
    }
  }
}
