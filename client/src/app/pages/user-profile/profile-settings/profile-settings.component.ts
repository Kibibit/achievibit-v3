import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { KbTimezone } from '@kibibit/achievibit-sdk';

import { GeneralApiService } from '../../../services/api/general.service';


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
  browserTimezoneOffset: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  browserTimezone?: KbTimezone;
  supportedTimezones$ = this.generalApiService.getSupportedTimezones();
  browserInferredDateFormat = this.inferLuxonFormatFromParts();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly generalApiService: GeneralApiService
  ) {
    this.supportedTimezones$
      .subscribe((timezonesByUtcOffset) => {
        this.browserTimezone = timezonesByUtcOffset[this.browserTimezoneOffset];

        console.log('🕒 Browser timezone offset:', this.browserTimezoneOffset);
        console.log('🕒 Browser timezone:', this.browserTimezone);
      });
  }

  ngOnInit() {
    this.user = this.route.snapshot.data[this.dataKey];
  }

  inferLuxonFormatFromParts() {
    const parts = new Intl.DateTimeFormat(navigator.language).formatToParts(new Date());

    return parts
      .map((part) => {
        switch (part.type) {
          case 'day': return 'DD';
          case 'month': return 'MM';
          case 'year': return 'YYYY';
          case 'literal': return part.value;
          default: return '';
        }
      })
      .join('');
  }
}
