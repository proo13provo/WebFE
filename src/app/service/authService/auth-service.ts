import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginState = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn = this.loginState.asObservable();

  login(token: string) {
    localStorage.setItem('token', token);
    this.loginState.next(true);
  }
  logout() {
    localStorage.removeItem('token');
    this.loginState.next(false);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
