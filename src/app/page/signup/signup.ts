import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements AfterViewInit {
  @ViewChild('registrationForm') registrationForm!: ElementRef<HTMLFormElement>;
  @ViewChild('togglePassword') togglePassword!: ElementRef<HTMLDivElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef<HTMLInputElement>;
  @ViewChild('strengthBar') strengthBar!: ElementRef<HTMLDivElement>;
  @ViewChild('usernameError') usernameError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('emailError') emailError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('passwordError') passwordError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('confirmError') confirmError!: ElementRef<HTMLParagraphElement>;
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('successModal') successModal!: ElementRef<HTMLDivElement>;
  @ViewChild('closeModal') closeModal!: ElementRef<HTMLButtonElement>;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Password toggle functionality
    this.togglePassword.nativeElement.addEventListener('click', () => {
      const passwordInput = this.password.nativeElement;
      const confirmPasswordInput = this.confirmPassword.nativeElement;
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      confirmPasswordInput.type = type;
      this.togglePassword.nativeElement.innerHTML = type === 'password'
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });

    // Password strength meter
    this.password.nativeElement.addEventListener('input', (event: any) => {
      const value = event.target.value;
      const strength = this.calculatePasswordStrength(value);
      const bar = this.strengthBar.nativeElement;
      if (strength < 2) {
        bar.className = 'h-1 rounded-full bg-red-500';
        bar.style.width = '25%';
      } else if (strength < 4) {
        bar.className = 'h-1 rounded-full bg-yellow-500';
        bar.style.width = '50%';
      } else if (strength < 6) {
        bar.className = 'h-1 rounded-full bg-blue-500';
        bar.style.width = '75%';
      } else {
        bar.className = 'h-1 rounded-full bg-green-500';
        bar.style.width = '100%';
      }
    });

    // Form validation & API call
    this.registrationForm.nativeElement.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      // Reset errors
      this.usernameError.nativeElement.classList.add('hidden');
      this.emailError.nativeElement.classList.add('hidden');
      this.passwordError.nativeElement.classList.add('hidden');
      this.confirmError.nativeElement.classList.add('hidden');

      let isValid = true;
      const username = (this.registrationForm.nativeElement.querySelector('#username') as HTMLInputElement).value;
      const email = (this.registrationForm.nativeElement.querySelector('#email') as HTMLInputElement).value;
      const pass = (this.password.nativeElement as HTMLInputElement).value;
      const confirmPass = (this.confirmPassword.nativeElement as HTMLInputElement).value;

      if (username.length < 4 || username.length > 16) {
        this.usernameError.nativeElement.classList.remove('hidden');
        (this.registrationForm.nativeElement.querySelector('#username') as HTMLInputElement).classList.add('shake');
        isValid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.emailError.nativeElement.classList.remove('hidden');
        (this.registrationForm.nativeElement.querySelector('#email') as HTMLInputElement).classList.add('shake');
        isValid = false;
      }
      if (pass.length < 8) {
        this.passwordError.nativeElement.classList.remove('hidden');
        (this.password.nativeElement as HTMLInputElement).classList.add('shake');
        isValid = false;
      }
      if (pass !== confirmPass) {
        this.confirmError.nativeElement.classList.remove('hidden');
        (this.confirmPassword.nativeElement as HTMLInputElement).classList.add('shake');
        isValid = false;
      }

      setTimeout(() => {
        (this.registrationForm.nativeElement.querySelector('#username') as HTMLInputElement).classList.remove('shake');
        (this.registrationForm.nativeElement.querySelector('#email') as HTMLInputElement).classList.remove('shake');
        (this.password.nativeElement as HTMLInputElement).classList.remove('shake');
        (this.confirmPassword.nativeElement as HTMLInputElement).classList.remove('shake');
      }, 500);

      if (isValid) {
        this.submitBtn.nativeElement.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        this.submitBtn.nativeElement.disabled = true;

        // Gọi API đăng ký
        this.http.post('https://easily-on-wasp.ngrok-free.app/user/create', {
          username: username,
          password: pass,
          email: email
        }).subscribe({
          next: (res) => {
            this.successModal.nativeElement.classList.remove('hidden');
            this.submitBtn.nativeElement.innerHTML = 'Create Account';
            this.submitBtn.nativeElement.disabled = false;
          },
          error: (err) => {
            alert('Đăng ký thất bại!');
            this.submitBtn.nativeElement.innerHTML = 'Create Account';
            this.submitBtn.nativeElement.disabled = false;
          }
        });
      }
    });

    // Close modal
    this.closeModal.nativeElement.addEventListener('click', () => {
      this.successModal.nativeElement.classList.add('hidden');
    });
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    strength += Math.min(3, Math.floor(password.length / 3));
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }
}
