import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login/login.component';
import { MovieListComponent } from './features/movies/components/movies-list/movies-list.component';
import { MovieDetailsComponent } from './features/movies/components/movie-details/movie-details.component';
import { SearchResultsComponent } from './features/movies/components/search-results/search-results.component';
import { FavoritesComponent } from './features/favorites/components/favorites/favorites.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'movies', component: MovieListComponent, canActivate: [authGuard] },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'search', component: SearchResultsComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];