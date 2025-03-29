import { StatusCodes } from 'http-status-codes';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { MeApiService } from './services/api/me.service';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';
import { SocketService } from './services/socket.service';
import { AchievementComponent } from './shared/achievement/achievement.component';
import { HeaderComponent } from './shared/header/header.component';
import { MiniGameComponent } from './shared/mini-game/mini-game.component';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    AchievementComponent,
    AchievementComponent,
    HeaderComponent,
    MiniGameComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  hideUserState: boolean = true;
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
    private loaderService: LoaderService,
    private readonly authService: AuthService
  ) {
    this.messageSubscription = this.socketService
      .on('ping')
      .subscribe((data) => {
        // this.messages.push(data.text);
        console.log('Received ping message:', data);
      });
  }

  sendMessage() {
    this.socketService.emit('message', { text: this.newMessage });
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // do I even need this here? if I move the navbar element into a component,
    // I can just hide it there and only redirect to login if the user tries to
    // access a page that requires authentication
    this
      .meApiService
      .checkUserLoggedIn()
      .subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.loggedInUser = user;
          this.hideUserState = false;
        },
        error: (error: { status: number; message: string }) => {
          this.hideUserState = false;
          if (error.status === StatusCodes.UNAUTHORIZED) {
            console.log('User not logged in:');
            return;
          }

          // Handle other errors
          window.location.href = '/login';
        }
      });
  }
}
