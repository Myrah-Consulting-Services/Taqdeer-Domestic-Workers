import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Listen to navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // If user is admin and trying to access regular dashboard, redirect to admin dashboard
        if (this.authService.isAdmin() && event.url === '/dashboard') {
          this.router.navigate(['/admin-dashboard']);
        }
        // If user is not admin and trying to access admin dashboard, redirect to regular dashboard
        else if (!this.authService.isAdmin() && event.url === '/admin-dashboard') {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
