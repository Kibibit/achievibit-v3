import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';


@Component({
  selector: 'kb-user-profile',
  standalone: true,
  imports: [ NgIf, AsyncPipe ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private readonly dataKey = 'user';
  user!: User;

  constructor(
    private readonly route: ActivatedRoute
  ) {
    this.user = this.route.snapshot.data[this.dataKey];
  }
}
