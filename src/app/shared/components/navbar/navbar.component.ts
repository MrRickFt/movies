import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
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
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user$!: Observable<User | null>;
  isMenuOpen = false;
  isSearchVisible = false;
  isMobile = false;
  scrolled = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;
  }

  searchMovies(query: string) {
    if (query?.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: query.trim(), type: 'title' },
      });
      if (this.searchInput) {
        this.searchInput.nativeElement.value = '';
      }
      if (this.isMobile) {
        this.isSearchVisible = false;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isSearchVisible = false;
    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (this.isSearchVisible) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 100);
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/login']);
      this.isMenuOpen = false;
    });
  }
}
