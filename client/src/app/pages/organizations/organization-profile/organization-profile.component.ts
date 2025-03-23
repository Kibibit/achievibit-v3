import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Organization } from '@kibibit/achievibit-sdk';

@Component({
  selector: 'kb-organization-profile',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './organization-profile.component.html',
  styleUrl: './organization-profile.component.scss'
})
export class OrganizationProfileComponent {
  private readonly dataKey = 'organization';
  org!: Organization;

  constructor(
    private readonly route: ActivatedRoute
  ) {
    this.org = this.route.snapshot.data[this.dataKey];
  }
}
