import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Thêm import này
import { FormsModule } from '@angular/forms';
import {AsyncPipe, NgClass} from '@angular/common';
import {AuthService} from '../../service/authService/auth-service';
import {LoadService} from '../../service/loadService/load-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  isPasswordVisible: boolean = false;
  @ViewChild('loginForm') loginForm!: ElementRef<HTMLFormElement>;
  @ViewChild('emailError') emailError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('togglePassword') togglePassword!: ElementRef<HTMLDivElement>;
  @ViewChild('passwordError') passwordError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) { } // Thêm Router vào constructor

  ngAfterViewInit() {
    this.togglePassword.nativeElement.addEventListener('click', () => {
      const passwordInput = this.password.nativeElement;
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      this.togglePassword.nativeElement.innerHTML = type === 'password'
        ? '<i class="fas fa-eye text-gray-400 hover:text-gray-300"></i>'
        : '<i class="fas fa-eye-slash text-gray-400 hover:text-gray-300"></i>';
    })

    // Form validation & API call
    this.loginForm.nativeElement.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.emailError.nativeElement.classList.add('hidden');
      this.passwordError.nativeElement.classList.add('hidden');

      const email = (this.loginForm.nativeElement.querySelector('#email') as HTMLInputElement).value;
      const pass = (this.password.nativeElement as HTMLInputElement).value;

      let isValid = true;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.emailError.nativeElement.classList.remove('hidden');
        (this.loginForm.nativeElement.querySelector('#email') as HTMLInputElement).classList.add('shake');
        isValid = false;
      }
      if (pass.length < 8) {
        this.passwordError.nativeElement.classList.remove('hidden');
        (this.password.nativeElement as HTMLInputElement).classList.add('shake');
        isValid = false;
      }
      setTimeout(() => {
        (this.loginForm.nativeElement.querySelector('#email') as HTMLInputElement).classList.remove('shake');
        (this.password.nativeElement as HTMLInputElement).classList.remove('shake');
      }, 500);
      if (isValid) {
        this.submitBtn.nativeElement.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        this.submitBtn.nativeElement.disabled = true;

        // Gọi API đăng nhập
        this.http.post<any>('https://easily-on-wasp.ngrok-free.app/auth/login', {
          password: pass,
          email: email
        }).subscribe({
          next: (res) => {
            this.submitBtn.nativeElement.disabled = false;
            this.submitBtn.nativeElement.innerHTML = 'Login to GameHub';
            if (res?.result?.message === true && res?.result?.token) {
              localStorage.setItem('token', res.result.token);
              this.authService.login(res.result.token); // Thêm dòng này
              this.router.navigate(['/main']);
            } else {
              alert('Đăng nhập thất bại!');
            }
          },
          error: (err) => {
            this.submitBtn.nativeElement.disabled = false;
            this.submitBtn.nativeElement.innerHTML = 'Login to GameHub';
            alert('Đăng nhập thất bại!');
          }
        });
      }
    })
  }
  gotoSignin() {
    this.router.navigate(['/signin']);
  }
}
