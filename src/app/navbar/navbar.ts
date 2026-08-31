import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';

import { RouterLink, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  AuthService,
  User
} from '../auth/auth';

@Component({
  selector: 'app-navbar',

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.css'
})
export class Navbar
  implements OnInit, OnDestroy {


  // ==========================================
  // CURRENT USER
  // ==========================================

  currentUser: User | null = null;


  // ==========================================
  // PROFILE MENU
  // ==========================================

  isProfileMenuOpen = false;


  // ==========================================
  // USER SUBSCRIPTION
  // ==========================================

  private userSubscription?: Subscription;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.userSubscription =
      this.authService.currentUser$
        .subscribe(
          (user) => {

            this.currentUser = user;

            // Close menu if user logs out
            if (!user) {
              this.isProfileMenuOpen = false;
            }

          }
        );

  }


  // ==========================================
  // CLEANUP
  // ==========================================

  ngOnDestroy(): void {

    this.userSubscription?.unsubscribe();

  }


  // ==========================================
  // TOGGLE PROFILE MENU
  // ==========================================

  toggleProfileMenu(): void {

    if (!this.currentUser) {
      return;
    }

    this.isProfileMenuOpen =
      !this.isProfileMenuOpen;

  }


  // ==========================================
  // CLOSE PROFILE MENU
  // ==========================================

  closeProfileMenu(): void {

    this.isProfileMenuOpen = false;

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  async logout(): Promise<void> {

    this.closeProfileMenu();

    await this.authService.logout();

    await this.router.navigate(['/login']);

  }


  // ==========================================
  // USER INITIALS
  // ==========================================

  getUserInitials(): string {

    if (!this.currentUser?.username) {

      return '?';

    }


    const username =
      this.currentUser.username.trim();


    if (!username) {

      return '?';

    }


    return username
      .charAt(0)
      .toUpperCase();

  }


  // ==========================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ==========================================

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(event: MouseEvent): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest('.profile-container')
    ) {

      this.isProfileMenuOpen = false;

    }

  }

}
