import { combineLatest } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AppService } from './app.service';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [ RouterOutlet, NgIf, NgFor, RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  loggedInUser: any;

  constructor(
    private appService: AppService
  ) {}

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
