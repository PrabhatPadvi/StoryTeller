import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService, User } from '../auth/auth';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  currentUser: User | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.currentUser =
      this.authService.getCurrentUser();

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
  // MEMBER SINCE
  // ==========================================

  getMemberName(): string {

    if (!this.currentUser?.username) {
      return 'StoryTeller User';
    }

    return this.currentUser.username;
  }

}
