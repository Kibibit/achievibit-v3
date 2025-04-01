import { StatusCodes } from 'http-status-codes';
import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class AppComponent implements OnInit {
  hideUserState: boolean = true;
  loading$ = this.loaderService.loading$;
  loggedInUser?: User;
  menuOpen = false;
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
    (console as any).image = function(url: string, size = 100) {
      const image = new Image();
      image.src = url;
      image.onload = function() {
        const style = [
          'font-size: 1px;',
          'padding: ' + (this as any).height / 100 * size + 'px ' + (this as any).width / 100 * size + 'px;',
          'background: url(' + url + ') no-repeat;',
          'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
      };
    };
    const imageUrl = 'https://kibibit.io/kibibit-assets/1x/long-white.png';

    this.imageUrlToBase64(imageUrl)
      .then((base64) => {
        (console as any).image(base64, 30);
      })
      .catch(console.error);
  }

  private imageUrlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Important for cross-origin images!
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));

        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });
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
          // window.location.href = '/login';
        }
      });
  }
}
