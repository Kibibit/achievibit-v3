import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';
import { AppService } from './app.service';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  loggedInUser: any;

  private messageSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';

  constructor(
    private appService: AppService,
    private socketService: SocketService,
    private apiService: ApiService
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
    this.apiService.getApiDetails()
      .subscribe((data) => {
        console.log('Api details:', data);
      });

    this.apiService.healthCheck()
      .subscribe((data) => {
        console.log('Health check:', data);
      });

    this
      .apiService
      .getLoggedInUser()
      .subscribe((user) => {
        this.loggedInUser = user;
      });

    // TESTING: Uncomment to test cache
    // setInterval(() => {
    //   this
    //     .apiService
    //     .getLoggedInUser()
    //     .subscribe((user) => {
    //       console.log('Logged in user:', user);
    //     });
    // }, 5000);
  }
}
