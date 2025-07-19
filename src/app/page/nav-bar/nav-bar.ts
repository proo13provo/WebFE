import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../service/authService/auth-service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBar {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) { }
  gotoLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(state => {
      this.isLoggedIn = state;
    });
  }
  logout() {
    this.authService.logout();
  }

  isMobileMenuOpen = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

}
