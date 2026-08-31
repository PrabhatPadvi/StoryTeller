import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxTurnstileComponent } from 'ngx-turnstile';

import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    NgxTurnstileComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  isLoading = false;

  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  showPassword = false;
  showConfirmPassword = false;

  // ==========================================
  // CLOUDFLARE TURNSTILE
  // ==========================================

  captchaToken = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  togglePasswordVisibility(): void {

    this.showPassword =
      !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

  // ==========================================
  // CAPTCHA
  // ==========================================

  onCaptchaResolved(token: string | null): void {

    this.captchaToken =
      token ?? '';

    this.errorMessage = '';
  }

  onCaptchaExpired(): void {

    this.captchaToken = '';
  }

  onCaptchaError(): void {

    this.captchaToken = '';

    this.errorMessage =
      'CAPTCHA verification failed. Please try again.';
  }

  // ==========================================
  // REGISTER
  // ==========================================

  async register(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    // Prevent multiple clicks
    if (this.isLoading) {
      return;
    }

    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================

    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }

    // ==========================================
    // CAPTCHA
    // ==========================================

    if (!this.captchaToken) {

      this.errorMessage =
        'Please complete the CAPTCHA.';

      return;
    }

    this.isLoading = true;

    try {

      const result =
        await this.authService.register(
          this.username,
          this.email,
          this.password,
          this.captchaToken
        );

      if (!result.success) {

        this.errorMessage =
          result.message;

        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      this.successMessage =
        result.message;

      setTimeout(() => {

        this.router.navigate(['/login']);

      }, 1500);

    } catch (error) {

      console.error(
        'Registration error:',
        error
      );

      this.errorMessage =
        'Something went wrong. Please try again.';

    } finally {

      this.isLoading = false;
    }
  }
}
