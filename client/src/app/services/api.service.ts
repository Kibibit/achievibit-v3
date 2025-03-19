import { from } from 'rxjs';
import { Injectable } from '@angular/core';

import { Api } from '@kibibit/achievibit-sdk';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiService = new Api({});

  getApiDetails() {
    return from(this.apiService.appControllerGetApiDetails());
  }
}
