
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  user$!: Observable<User | null>;
  
  ngOnInit() {
    this.user$ = this.authService.user$;
  }
  
  searchMovies(query: string) {
    if (query?.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: query.trim(), type: 'title' }
      });
    }
  }
  
  logout() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}