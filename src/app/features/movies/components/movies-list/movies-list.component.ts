import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../../shared/material.module';

import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';

import { Movie } from '../../../../core/interfaces/movie';
import { MovieFactoryService } from '../../../../core/factories/movie-factory';


@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, MovieCardComponent],
  template: `
    <div class="container">
      <h1 class="page-title">Explorar Películas</h1>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!isLoading">
        <mat-tab-group animationDuration="200ms" color="accent">
          <mat-tab label="Populares">
            <div class="movie-grid">
              <app-movie-card 
                *ngFor="let movie of popularMovies" 
                [movie]="movie"
              ></app-movie-card>
            </div>
          </mat-tab>
          
          <mat-tab label="En Cartelera">
            <div class="movie-grid">
              <app-movie-card 
                *ngFor="let movie of nowPlayingMovies" 
                [movie]="movie"
              ></app-movie-card>
            </div>
          </mat-tab>
          
          <mat-tab label="Mejor Valoradas">
            <div class="movie-grid">
              <app-movie-card 
                *ngFor="let movie of topRatedMovies" 
                [movie]="movie"
              ></app-movie-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    
    .page-title {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 24px;
      color: #3f51b5;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
      padding: 24px 0;
    }
    
    @media (max-width: 599px) {
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 16px;
      }
    }
  `]
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