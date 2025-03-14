import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  isLoading = true;

  ngOnInit() {
    const popularFactory = this.movieFactoryService.getFactory('popular');
    const nowPlayingFactory = this.movieFactoryService.getFactory('nowPlaying');
    const topRatedFactory = this.movieFactoryService.getFactory('topRated');
    
    forkJoin({
      popular: popularFactory.getMovies(),
      nowPlaying: nowPlayingFactory.getMovies(),
      topRated: topRatedFactory.getMovies()
    }).subscribe({
      next: (result) => {
        this.popularMovies = result.popular;
        this.nowPlayingMovies = result.nowPlaying;
        this.topRatedMovies = result.topRated;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las películas', error);
        this.isLoading = false;
      }
    });
  }
}