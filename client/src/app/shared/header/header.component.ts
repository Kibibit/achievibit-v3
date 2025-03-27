import { StatusCodes } from 'http-status-codes';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { MeApiService } from '../../services/api/me.service';
import { LoaderService } from '../../services/loader.service';
import { AchievibitLogoComponent } from '../achievibit-logo/achievibit-logo.component';
import { UserLivesComponent } from '../user-lives/user-lives.component';

@Component({
  selector: 'kb-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    UserLivesComponent,
    AchievibitLogoComponent,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  hideUserState: boolean = true;
  loading$ = this.loaderService.loading$;
  menuOpen = false;
  loggedInUser?: User;

  constructor(
    private loaderService: LoaderService,
    private authService: MeApiService,
    private meApiService: MeApiService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false;
      }

      if (event instanceof NavigationStart) {
        this.loaderService.show();
        this.menuOpen = false;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
        this.menuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    // do I even need this here? if I move the navbar element into a component,
    // I can just hide it there and only redirect to login if the user tries to
    // access a page that requires authentication
    this
      .authService
      .getLoggedInUser()
      .subscribe({
        next: (user) => {
          this.loggedInUser = user;
          this.hideUserState = false;
        },
        error: (error: { status: number; message: string }) => {
          this.hideUserState = false;
          if (error.status === StatusCodes.UNAUTHORIZED) {
            console.log('User not logged in:');
            return;
          }
        }
      });
  }

  logout() {
    this.meApiService.logout()
      .subscribe(() => {
        // window.location.href = '/login';
        // eslint-disable-next-line no-undefined
        this.loggedInUser = undefined;

        // if url contains /me, redirect to login
        // instead do this in a router guard?
        if (window.location.pathname.includes('/me') || window.location.pathname.includes('/profile')) {
          window.location.href = '/login';
        }
      });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
