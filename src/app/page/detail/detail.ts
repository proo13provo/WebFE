import { Component } from '@angular/core';
import {NavBar} from '../nav-bar/nav-bar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-detail',
  imports: [
    NavBar,
    Footer
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail {
  constructor() {
  }
}
