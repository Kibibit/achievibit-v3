import { combineLatest, Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SocketService } from './services/socket.service';
import { AppService } from './app.service';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, NgFor, RouterLink ],
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
    private socketService: SocketService
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
    const loggedInUserObs = this
      .appService
      .getLoggedInUser();

    // Combine the two observables to get the user and their repos
    combineLatest([ loggedInUserObs ])
      .subscribe(([ user ]) => {
        this.loggedInUser = user;
      });
  }
}
