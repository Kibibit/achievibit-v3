import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  user: any

  constructor(
    private http: HttpClient
  ) { }

  getLoggedInUser() {
    return this.http.get('/api/me');
  }

  getUserRepos() {
    return this.http.get('/api/me/integrations/all/available');
  }
}
