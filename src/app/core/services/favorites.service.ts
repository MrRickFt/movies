// src/app/core/services/favorites.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, query, where, getDocs, doc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Movie } from '../interfaces/movie';



@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  constructor() {}

  addToFavorites(movie: Movie): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(false);
        
        const favoritesCollection = collection(this.firestore, 'favorites');
        return from(addDoc(favoritesCollection, {
          userId: user.uid,
          movieId: movie.id,
          movie: movie,
          createdAt: new Date()
        })).pipe(
          map(() => true),
          catchError(err => {
            console.error('Error adding to favorites', err);
            return of(false);
          })
        );
      })
    );
  }

  removeFromFavorites(movieId: number): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(false);
        
        const favoritesCollection = collection(this.firestore, 'favorites');
        const q = query(favoritesCollection, 
          where('userId', '==', user.uid),
          where('movieId', '==', movieId)
        );
        
        return from(getDocs(q)).pipe(
          switchMap(querySnapshot => {
            const deletePromises: Promise<void>[] = [];
            
            querySnapshot.forEach(document => {
              deletePromises.push(deleteDoc(doc(this.firestore, 'favorites', document.id)));
            });
            
            if (deletePromises.length === 0) return of(false);
            
            return from(Promise.all(deletePromises)).pipe(
              map(() => true),
              catchError(err => {
                console.error('Error removing from favorites', err);
                return of(false);
              })
            );
          })
        );
      })
    );
  }

  getFavorites(): Observable<Movie[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        const favoritesCollection = collection(this.firestore, 'favorites');
        const q = query(favoritesCollection, where('userId', '==', user.uid));
        
        return from(getDocs(q)).pipe(
          map(querySnapshot => {
            const favorites: Movie[] = [];
            querySnapshot.forEach(doc => {
              const data = doc.data() as { movie: Movie };
              favorites.push(data.movie);
            });
            return favorites;
          }),
          catchError(err => {
            console.error('Error getting favorites', err);
            return of([]);
          })
        );
      })
    );
  }

  isFavorite(movieId: number): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(false);
        
        const favoritesCollection = collection(this.firestore, 'favorites');
        const q = query(favoritesCollection, 
          where('userId', '==', user.uid),
          where('movieId', '==', movieId)
        );
        
        return from(getDocs(q)).pipe(
          map(querySnapshot => !querySnapshot.empty),
          catchError(err => {
            console.error('Error checking if movie is favorite', err);
            return of(false);
          })
        );
      })
    );
  }
}