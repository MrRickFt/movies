import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, user } from '@angular/fire/auth';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(Auth);
  user$ = user(this.auth).pipe(
    map(user => user ? {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Usuario',
      photoURL: user.photoURL || 'assets/default-avatar.png'
    } : null)
  );

  constructor() {}

  googleSignIn(): Observable<User> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()))
      .pipe(
        map(result => {
          const user = result.user;
          if (!user) {
            throw new Error('No user authenticated');
          }
          return user;
        })
      );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }
}
