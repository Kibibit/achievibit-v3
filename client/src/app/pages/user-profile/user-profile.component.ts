import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'kb-active-user-profile',
  standalone: true,
  imports: [ NgIf, NgFor, RouterModule ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  activeTab = 'overview';

  constructor(
    private readonly route: ActivatedRoute
  ) {}

  getActiveTabFromUrl() {
    this.route.firstChild?.url.subscribe((url) => {
      this.activeTab = url[0]?.path || 'overview';
    });
  }
}
