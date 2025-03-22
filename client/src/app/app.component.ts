import { Subscription } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';

import { GeneralApiService } from './services/api/general.service';
import { HealthApiService } from './services/api/health.service';
import { MeApiService } from './services/api/me.service';
import { LoaderService } from './services/loader.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, RouterLink, AsyncPipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  loading$ = this.loaderService.loading$;
  loggedInUser: any;
  menuOpen = false;

  private messageSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';

  constructor(
    private socketService: SocketService,
    private meApiService: MeApiService,
    private generalApiService: GeneralApiService,
    private healthApiService: HealthApiService,
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

  sendMessage() {
    this.socketService.emit('message', { text: this.newMessage });
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.generalApiService.getApiDetails()
      .subscribe((data) => {
        console.log('Api details:', data);
      });

    this.healthApiService.healthCheck()
      .subscribe((data) => {
        console.log('Health check:', data);
      });

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
}
