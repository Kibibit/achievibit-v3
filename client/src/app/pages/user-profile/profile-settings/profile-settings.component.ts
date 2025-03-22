import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'kb-profile-settings',
  standalone: true,
  imports: [ NgIf, AsyncPipe ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent implements OnInit {
  private readonly dataKey = 'user';
  user: any;

  constructor(
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data[this.dataKey];
  }
}
