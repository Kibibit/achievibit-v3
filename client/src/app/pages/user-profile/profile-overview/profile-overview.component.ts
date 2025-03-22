import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'kb-profile-overview',
  standalone: true,
  imports: [ NgIf, AsyncPipe ],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss'
})
export class ProfileOverviewComponent implements OnInit {
  private readonly dataKey = 'user';
  user: any;

  constructor(
      private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data[this.dataKey];
  }
}
