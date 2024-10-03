import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { NgFor, NgIf } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  loggedInUser: any;
  userRepos: any;

  constructor(
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    const loggedInUserObs = this
      .appService
      .getLoggedInUser();

    const userReposObs = this
      .appService
      .getUserRepos();

    // Combine the two observables to get the user and their repos
    combineLatest([loggedInUserObs, userReposObs])
      .subscribe(([user, repos]) => {
        this.loggedInUser = user;
        this.userRepos = repos;
      });
  }
}
