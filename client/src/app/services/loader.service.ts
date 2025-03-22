import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
