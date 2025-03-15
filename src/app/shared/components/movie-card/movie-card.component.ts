import { Component, Input, OnInit, inject, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { Observable } from 'rxjs';
import { Movie } from '../../../core/interfaces/movie';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;
  @Input() showRemoveButton: boolean = false;
  
  private readonly favoritesService = inject(FavoritesService);
  
  isFavorite$!: Observable<boolean>;
  
  isFavoriteSignal = computed(() => {
    return this.favoritesService.favorites().has(this.movie?.id);
  });
  
  ngOnInit() {
    this.isFavorite$ = this.favoritesService.isFavorite(this.movie.id);
  }
  
  getRatingClass(rating: number): string {
    if (rating >= 7) return 'rating-high';
    if (rating >= 5) return 'rating-medium';
    return 'rating-low';
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation();
    
    if (this.isFavoriteSignal()) {
      this.favoritesService.removeFromFavorites(this.movie.id).subscribe();
    } else {
      this.favoritesService.addToFavorites(this.movie).subscribe();
    }

  }
}