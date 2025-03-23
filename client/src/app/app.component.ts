import { Subscription } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { MeApiService } from './services/api/me.service';
import { LoaderService } from './services/loader.service';
import { SocketService } from './services/socket.service';
import { AchievementComponent } from './shared/achievement/achievement.component';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, RouterLink, AsyncPipe, RouterLinkActive, AchievementComponent, AchievementComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  loading$ = this.loaderService.loading$;
  loggedInUser?: User;
  menuOpen = false;

  private messageSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';

  @ViewChild('userMenuDialog') userMenuDialog!: ElementRef<HTMLDialogElement>;

  constructor(
    private socketService: SocketService,
    private meApiService: MeApiService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.messageSubscription = this.socketService
      .on('ping')
      .subscribe((data) => {
        // this.messages.push(data.text);
        console.log('Received ping message:', data);
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false;
      }

      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
      }
    });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  sendMessage() {
    this.socketService.emit('message', { text: this.newMessage });
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this
      .meApiService
      .getLoggedInUser()
      .subscribe((user) => {
        this.loggedInUser = user;
      });

    // TESTING: Uncomment to test cache
    // setInterval(() => {
    //   this
    //     .meApiService
    //     .getLoggedInUser()
    //     .subscribe((user) => {
    //       console.log('Logged in user:', user);
    //     });
    // }, 5000);
  }

  logout() {
    this.meApiService.logout()
      .subscribe(() => {
        window.location.href = '/login';
      });
  }
}
