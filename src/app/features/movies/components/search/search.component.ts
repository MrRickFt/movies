// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Observable, debounceTime, filter, map, startWith, switchMap } from 'rxjs';
// import { MaterialModule } from '../../../../shared/material.module';
// import { MovieService } from '../../../../core/services/movies.service';

// @Component({
//   selector: 'app-search',
//   standalone: true,
//   imports: [CommonModule,
//             MaterialModule, 
//             ReactiveFormsModule,
//             ],
//   template: `
//     <div class="search-container">
//       <div class="search-methods">
//         <mat-button-toggle-group #group="matButtonToggleGroup" value="title" (change)="searchMethodChanged(group.value)">
//           <mat-button-toggle value="title">Buscar por título</mat-button-toggle>
//           <mat-button-toggle value="genre">Buscar por género</mat-button-toggle>
//         </mat-button-toggle-group>
//       </div>
      
//       <div *ngIf="searchMethod === 'title'" class="search-by-title">
//         <mat-form-field appearance="outline" class="search-field">
//           <mat-label>Buscar película</mat-label>
//           <input matInput [formControl]="searchControl" placeholder="Buscar por título..." autocomplete="off">
//           <mat-icon matPrefix>search</mat-icon>
//           <mat-icon *ngIf="searchControl.value" matSuffix (click)="clearSearch()">close</mat-icon>
//         </mat-form-field>
        
//         <mat-autocomplete #auto="matAutocomplete" (optionSelected)="optionSelected($event.option.value)">
//           <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
//             {{ option }}
//           </mat-option>
//         </mat-autocomplete>
//       </div>
      
//       <div *ngIf="searchMethod === 'genre'" class="search-by-genre">
//         <mat-form-field appearance="outline" class="search-field">
//           <mat-label>Seleccionar género</mat-label>
//           <mat-select (selectionChange)="genreSelected($event.value)">
//             <mat-option *ngFor="let genre of genres$ | async" [value]="genre.id">
//               {{ genre.name }}
//             </mat-option>
//           </mat-select>
//           <mat-icon matPrefix>category</mat-icon>
//         </mat-form-field>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .search-container {
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       padding: 16px;
//       background-color: #f5f5f5;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//     }
    
//     .search-methods {
//       display: flex;
//       justify-content: center;
//     }
    
//     .search-field {
//       width: 100%;
//     }
    
//     @media (max-width: 599px) {
//       .search-container {
//         padding: 12px;
//       }
//     }
//   `]
// })
// export class SearchComponent {
//   private readonly router = inject(Router);
//   private readonly movieService = inject(MovieService);
  
//   searchControl = new FormControl('');
//   searchMethod = 'title';
  
//   filteredOptions: Observable<string[]> = this.searchControl.valueChanges.pipe(
//     startWith(''),
//     debounceTime(300),
//     filter(value => value !== null && value.length > 2),
//     switchMap(value => this.movieService.searchMovies(value || '').pipe(
//       map(movies => movies.slice(0, 5).map(movie => movie.title))
//     ))
//   );
  
//   genres$ = this.movieService.getGenres();
  
//   searchMethodChanged(method: string) {
//     this.searchMethod = method;
//   }
  
//   clearSearch() {
//     this.searchControl.setValue('');
//   }
  
//   optionSelected(movieName: string) {
//     this.router.navigate(['/search'], {
//       queryParams: { q: movieName, type: 'title' }
//     });
//   }
  
//   genreSelected(genreId: number) {
//     this.router.navigate(['/search'], {
//       queryParams: { genreId: genreId, type: 'genre' }
//     });
//   }
// }