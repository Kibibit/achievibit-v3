import { catchError, debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ServerValidationError } from '../../../services/api/api-error-handler';
import { PullRequestsApiService } from '../../../services/api/pull-requests.service';
import { FirstErrorPipe } from '../../../shared/pipes/first-error.pipe';

const threeSeconds = 1500;
const halfASecond = 500;

@Component({
  selector: 'kb-pull-request-all',
  standalone: true,
  imports: [ DatePipe, NgFor, NgIf, AsyncPipe, ReactiveFormsModule, RouterLink, FirstErrorPipe ],
  templateUrl: './pull-request-all.component.html',
  styleUrl: './pull-request-all.component.scss'
})
export class PullRequestAllComponent {
  private readonly searchDebounceTime = halfASecond;
  private readonly urlUpdateDebounceTime = threeSeconds;

  searchControl = new FormControl('');
  searchControlErrors$ = this.searchControl.statusChanges.pipe(
    startWith(this.searchControl.status),
    map(() => this.searchControl.errors || {})
  );

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
  $prs = this.search$.pipe(
    debounceTime(this.searchDebounceTime),
    switchMap((query) =>
      this.prsApiService.getAllPrs({
        query: query || '',
        take: 50
      })
        .pipe(
          map((prs) => prs || {}),
          catchError((error) => {
            if (error instanceof ServerValidationError) {
              const queryError = error.errors.find((e) => e.property === 'query');
              if (queryError) {
                this.searchControl.setErrors({ server: queryError.constraints });
                this.searchControl.markAsTouched();
              }
            }

            return [];
          })
        )
    )
  );

  constructor(
      private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly prsApiService: PullRequestsApiService
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
