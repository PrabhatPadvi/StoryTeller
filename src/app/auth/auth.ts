import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { supabase } from '../services/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ==========================================
  // CURRENT USER
  // ==========================================

  private currentUser: User | null = null;

  // Reactive user state
  private currentUserSubject =
    new BehaviorSubject<User | null>(null);

  // Navbar and other components can subscribe to this
  currentUser$ =
    this.currentUserSubject.asObservable();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    // Check existing Supabase session
    // when the application starts.
    this.loadCurrentUser();


    // Listen for Supabase authentication changes.
    supabase.auth.onAuthStateChange(
      (event, session) => {

        // User logged out
        if (event === 'SIGNED_OUT') {

          this.currentUser = null;

          this.currentUserSubject.next(null);

          return;
        }


        // User logged in / session restored
        if (session?.user) {

          this.loadCurrentUser();

        }

      }
    );

  }


  // ==========================================
  // REGISTER
  // ==========================================

  async register(
    username: string,
    email: string,
    password: string,
    captchaToken?: string
  ): Promise<{ success: boolean; message: string }> {

    username = username.trim();

    email = email.trim().toLowerCase();


    // ==========================================
    // EMPTY FIELDS
    // ==========================================

    if (!username || !email || !password) {

      return {
        success: false,
        message: 'Please fill in all fields.'
      };

    }


    // ==========================================
    // USERNAME VALIDATION
    // ==========================================

    if (!/^[A-Za-z]/.test(username)) {

      return {
        success: false,
        message: 'Username must start with a letter.'
      };

    }


    if (!/^[A-Za-z][A-Za-z0-9_]{2,19}$/.test(username)) {

      return {
        success: false,
        message:
          'Username must be 3-20 characters and contain only letters, numbers, and underscores.'
      };

    }


    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      return {
        success: false,
        message: 'Please enter a valid email address.'
      };

    }


    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (!this.isStrongPassword(password)) {

      return {
        success: false,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      };

    }


    // ==========================================
    // CAPTCHA
    // ==========================================

    if (!captchaToken) {

      return {
        success: false,
        message: 'Please complete the CAPTCHA.'
      };

    }


    // ==========================================
    // CHECK USERNAME AVAILABILITY
    // ==========================================

    const {
      data: usernameExists,
      error: usernameCheckError
    } = await supabase.rpc(
      'username_exists',
      {
        requested_username: username
      }
    );


    if (usernameCheckError) {

      console.error(
        'Username check error:',
        usernameCheckError
      );

      return {
        success: false,
        message:
          'Unable to check username availability.'
      };

    }


    if (usernameExists === true) {

      return {
        success: false,
        message:
          'Username is already taken.'
      };

    }


    // ==========================================
    // CREATE SUPABASE AUTH ACCOUNT
    // ==========================================

    const {
      data,
      error
    } = await supabase.auth.signUp({

      email,

      password,

      options: {

        captchaToken,

        data: {
          username
        }

      }

    });


    if (error) {

      console.error(
        'Registration error:',
        error
      );

      return {
        success: false,
        message:
          this.getAuthErrorMessage(error.message)
      };

    }


    // ==========================================
    // EMAIL CONFIRMATION REQUIRED
    // ==========================================

    if (data.user && !data.session) {

      return {
        success: true,
        message:
          'Account created. Please check your email and verify your account.'
      };

    }


    // ==========================================
    // ACCOUNT CREATED AND LOGGED IN
    // ==========================================

    if (data.user) {

      await this.loadCurrentUser();

      return {
        success: true,
        message:
          'Account created successfully.'
      };

    }


    return {
      success: false,
      message:
        'Unable to create account.'
    };

  }


  // ==========================================
  // LOGIN
  // ==========================================

  async login(
    usernameOrEmail: string,
    password: string,
    captchaToken?: string
  ): Promise<{ success: boolean; message: string }> {

    const value =
      usernameOrEmail.trim();


    // ==========================================
    // EMPTY FIELDS
    // ==========================================

    if (!value || !password) {

      return {
        success: false,
        message:
          'Please fill in all fields.'
      };

    }


    // ==========================================
    // CAPTCHA
    // ==========================================

    if (!captchaToken) {

      return {
        success: false,
        message:
          'Please complete the CAPTCHA.'
      };

    }


    let email =
      value.toLowerCase();


    // ==========================================
    // LOGIN USING USERNAME
    // ==========================================

    if (!value.includes('@')) {

      const {
        data: foundEmail,
        error
      } = await supabase.rpc(
        'get_email_by_username',
        {
          requested_username: value
        }
      );


      if (error) {

        console.error(
          'Username lookup error:',
          error
        );

        return {
          success: false,
          message:
            'Unable to find account.'
        };

      }


      if (!foundEmail) {

        return {
          success: false,
          message:
            'Invalid username/email or password.'
        };

      }


      email = foundEmail;

    }


    // ==========================================
    // LOGIN WITH SUPABASE AUTH
    // ==========================================

    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({

      email,

      password,

      options: {
        captchaToken
      }

    });


    if (error) {

      console.error(
        'Login error:',
        error
      );

      return {
        success: false,
        message:
          'Invalid username/email or password.'
      };

    }


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    if (data.user) {

      await this.loadCurrentUser();

    }


    return {
      success: true,
      message:
        'Login successful.'
    };

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  async logout(): Promise<void> {

    const {
      error
    } = await supabase.auth.signOut();


    if (error) {

      console.error(
        'Logout error:',
        error
      );

      return;

    }


    this.currentUser = null;

    this.currentUserSubject.next(null);

  }


  // ==========================================
  // CURRENT USER
  // ==========================================

  getCurrentUser(): User | null {

    return this.currentUser;

  }


  // ==========================================
  // AUTH STATUS
  // ==========================================

  isLoggedIn(): boolean {

    return this.currentUser !== null;

  }


  // ==========================================
  // USER ID
  // ==========================================

  getCurrentUserId(): string | null {

    return this.currentUser
      ? this.currentUser.id
      : null;

  }


  // ==========================================
  // USERNAME
  // ==========================================

  getCurrentUsername(): string | null {

    return this.currentUser
      ? this.currentUser.username
      : null;

  }


  // ==========================================
  // EMAIL
  // ==========================================

  getCurrentUserEmail(): string | null {

    return this.currentUser
      ? this.currentUser.email
      : null;

  }


  // ==========================================
  // AVATAR
  // ==========================================

  getCurrentUserAvatar(): string | null {

    return this.currentUser?.avatarUrl ?? null;

  }


  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  private async loadCurrentUser(): Promise<void> {

    const {
      data,
      error
    } = await supabase.auth.getUser();


    // ==========================================
    // NO LOGGED-IN USER
    // ==========================================

    if (error || !data.user) {

      this.currentUser = null;

      this.currentUserSubject.next(null);

      return;

    }


    const authUser =
      data.user;


    // ==========================================
    // GET PROFILE
    // ==========================================

    const {
      data: profile,
      error: profileError
    } = await supabase
      .from('profiles')
      .select(
        'username, email, avatar_url'
      )
      .eq(
        'id',
        authUser.id
      )
      .maybeSingle();


    if (profileError) {

      console.error(
        'Profile loading error:',
        profileError
      );

    }


    // ==========================================
    // CREATE CURRENT USER OBJECT
    // ==========================================

    this.currentUser = {

      id: authUser.id,

      username:
        profile?.username ??
        authUser.user_metadata?.['username'] ??
        'User',

      email:
        profile?.email ??
        authUser.email ??
        '',

      avatarUrl:
        profile?.avatar_url ?? null

    };


    // ==========================================
    // IMPORTANT
    // ==========================================
    // Tell Navbar that the user is ready.

    this.currentUserSubject.next(
      this.currentUser
    );

  }


  // ==========================================
  // STRONG PASSWORD
  // ==========================================

  private isStrongPassword(
    password: string
  ): boolean {

    const minimumLength =
      password.length >= 8;

    const uppercase =
      /[A-Z]/.test(password);

    const lowercase =
      /[a-z]/.test(password);

    const number =
      /[0-9]/.test(password);

    const special =
      /[^A-Za-z0-9]/.test(password);


    return (
      minimumLength &&
      uppercase &&
      lowercase &&
      number &&
      special
    );

  }


  // ==========================================
  // AUTH ERROR MESSAGES
  // ==========================================

  private getAuthErrorMessage(
    error: string
  ): string {

    const message =
      error.toLowerCase();


    if (
      message.includes(
        'already registered'
      ) ||
      message.includes(
        'already exists'
      )
    ) {

      return (
        'An account with this email already exists.'
      );

    }


    if (
      message.includes(
        'invalid email'
      )
    ) {

      return (
        'Please enter a valid email address.'
      );

    }


    if (
      message.includes(
        'password'
      )
    ) {

      return (
        'Password does not meet the required security rules.'
      );

    }


    if (
      message.includes(
        'captcha'
      )
    ) {

      return (
        'CAPTCHA verification failed. Please try again.'
      );

    }


    if (
      message.includes(
        'rate limit'
      )
    ) {

      return (
        'Too many attempts. Please try again later.'
      );

    }


    return (
      'Unable to create account. Please try again.'
    );

  }

}
