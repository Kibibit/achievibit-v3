import { debounceTime, distinctUntilChanged, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OrganizationsApiService } from '../../../services/api/organizations.service';

const threeSeconds = 1500;
const halfASecond = 500;

@Component({
  selector: 'kb-organizations-all',
  standalone: true,
  imports: [ DatePipe, NgFor, NgIf, AsyncPipe, ReactiveFormsModule, RouterLink ],
  templateUrl: './organizations-all.component.html',
  styleUrl: './organizations-all.component.scss'
})
export class OrganizationsAllComponent {
  private readonly searchDebounceTime = halfASecond;
  private readonly urlUpdateDebounceTime = threeSeconds;

  searchControl = new FormControl('');

  // Shared stream of the search input
  private search$ = this.searchControl.valueChanges.pipe(
    startWith(this.route.snapshot.queryParamMap.get('query') || ''),
    // optional: prevent duplicates
    distinctUntilChanged(),
    // share the stream across multiple subscribers
    shareReplay(1)
  );

  // 🌐 Debounced 3s stream for URL update
  private readonly urlUpdate$ = this.search$.pipe(
    debounceTime(this.urlUpdateDebounceTime),
    tap((query) => {
      this.router.navigate([], {
        queryParams: { query: query || null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    })
  );

  // 🔎 Debounced 500ms stream for API fetching
  $orgs = this.search$.pipe(
    debounceTime(this.searchDebounceTime),
    switchMap((query) =>
      this.organizationsApiService.getAllOrgs({
        query: query || '',
        take: 50
      })
    )
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organizationsApiService: OrganizationsApiService
  ) {
    // trigger URL side effect
    // will update the URL with the latest search query
    // this will replace the current URL in the browser history
    this.urlUpdate$.subscribe();

    const initialQuery = this.route.snapshot.queryParamMap.get('query') || '';
    // avoid double emission
    this.searchControl.setValue(initialQuery, { emitEvent: false });
  }
}
