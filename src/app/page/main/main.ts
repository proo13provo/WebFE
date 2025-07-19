import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NavBar} from '../nav-bar/nav-bar';
import {NgOptimizedImage} from '@angular/common';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NavBar,
    Footer
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main {
  constructor(private router: Router) { }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
  gotoDetail(){
    this.router.navigate(['/detail']);
  }
}
