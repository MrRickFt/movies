import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { MovieFactoryService } from '../../../../core/factories/movie-factory';
import { Movie } from '../../../../core/interfaces/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, MovieCardComponent],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MovieListComponent implements OnInit {
  private readonly movieFactoryService = inject(MovieFactoryService);
  
  popularMovies: Movie[] = [];
  nowPlayingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  
  popularTotalPages = 0;
  nowPlayingTotalPages = 0;
  topRatedTotalPages = 0;
  
  popularCurrentPage = 1;
  nowPlayingCurrentPage = 1;
  topRatedCurrentPage = 1;
  
  isLoading = true;

  ngOnInit() {
    this.loadAllMovieCategories();
  }
  
  loadAllMovieCategories() {
    this.isLoading = true;
    
    const popularFactory = this.movieFactoryService.getFactory('popular');
    const nowPlayingFactory = this.movieFactoryService.getFactory('nowPlaying');
    const topRatedFactory = this.movieFactoryService.getFactory('topRated');
    
    forkJoin({
      popular: popularFactory.getMovies(this.popularCurrentPage),
      nowPlaying: nowPlayingFactory.getMovies(this.nowPlayingCurrentPage),
      topRated: topRatedFactory.getMovies(this.topRatedCurrentPage)
    }).subscribe({
      next: (result) => {
        this.popularMovies = result.popular.results;
        this.nowPlayingMovies = result.nowPlaying.results;
        this.topRatedMovies = result.topRated.results;
        
        this.popularTotalPages = result.popular.totalPages;
        this.nowPlayingTotalPages = result.nowPlaying.totalPages;
        this.topRatedTotalPages = result.topRated.totalPages;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las películas', error);
        this.isLoading = false;
      }
    });
  }
  
  onPopularPageChange(event: PageEvent) {
    this.popularCurrentPage = event.pageIndex + 1;
    this.loadPopularMovies();
  }
  
  onNowPlayingPageChange(event: PageEvent) {
    this.nowPlayingCurrentPage = event.pageIndex + 1;
    this.loadNowPlayingMovies();
  }
  
  onTopRatedPageChange(event: PageEvent) {
    this.topRatedCurrentPage = event.pageIndex + 1;
    this.loadTopRatedMovies();
  }
  
  loadPopularMovies() {
    this.isLoading = true;
    const popularFactory = this.movieFactoryService.getFactory('popular');
    
    popularFactory.getMovies(this.popularCurrentPage).subscribe({
      next: (result) => {
        this.popularMovies = result.results;
        this.popularTotalPages = result.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar películas populares', error);
        this.isLoading = false;
      }
    });
  }
  
  loadNowPlayingMovies() {
    this.isLoading = true;
    const nowPlayingFactory = this.movieFactoryService.getFactory('nowPlaying');
    
    nowPlayingFactory.getMovies(this.nowPlayingCurrentPage).subscribe({
      next: (result) => {
        this.nowPlayingMovies = result.results;
        this.nowPlayingTotalPages = result.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar películas en cartelera', error);
        this.isLoading = false;
      }
    });
  }
  
  loadTopRatedMovies() {
    this.isLoading = true;
    const topRatedFactory = this.movieFactoryService.getFactory('topRated');
    
    topRatedFactory.getMovies(this.topRatedCurrentPage).subscribe({
      next: (result) => {
        this.topRatedMovies = result.results;
        this.topRatedTotalPages = result.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar películas mejor valoradas', error);
        this.isLoading = false;
      }
    });
  }
}