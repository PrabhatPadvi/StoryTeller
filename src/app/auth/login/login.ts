import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxTurnstileComponent } from 'ngx-turnstile';

import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    NgxTurnstileComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usernameOrEmail = '';
  password = '';

  errorMessage = '';
  isLoading = false;

  // Cloudflare Turnstile token
  captchaToken = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ==========================================
  // CAPTCHA
  // ==========================================

  onCaptchaResolved(token: string | null): void {

    this.captchaToken = token ?? '';

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
  // LOGIN
  // ==========================================

  async login(): Promise<void> {

    this.errorMessage = '';

    // Prevent multiple clicks
    if (this.isLoading) {
      return;
    }

    // Check CAPTCHA
    if (!this.captchaToken) {

      this.errorMessage =
        'Please complete the CAPTCHA.';

      return;
    }

    this.isLoading = true;

    try {

      const result =
        await this.authService.login(
          this.usernameOrEmail,
          this.password,
          this.captchaToken
        );

      if (!result.success) {

        this.errorMessage =
          result.message;

        return;
      }

      // ==========================================
      // LOGIN SUCCESSFUL
      // ==========================================

      await this.router.navigate(['/']);

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      this.errorMessage =
        'Something went wrong. Please try again.';

    } finally {

      this.isLoading = false;
    }
  }
}
