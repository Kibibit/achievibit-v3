// import { WebhooksService } from '@kibibit/achievibit-angular-sdk';
import { map, Observable, of, shareReplay } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private $user?: Observable<any> | null;
  private $userGithubRepos?: Observable<any> | null;
  private $userGitlabRepos?: Observable<any> | null;
  private $userBitbucketRepos?: Observable<any> | null;

  private timeoutDuration = 60000;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
    // private webhooksService: WebhooksService
  ) { }

  installGithubApp() {
    const appName = 'achievibit-beta';
    this.document.location.href = `https://github.com/apps/${ appName }/installations/new`;
  }

  getUserRepos(system: string) {
    switch (system) {
      case 'github':
        if (!this.$userGithubRepos) {
          this.refreshUserRepos(system);
        }

        return this.$userGithubRepos as Observable<any>;
      case 'gitlab':
        if (!this.$userGitlabRepos) {
          this.refreshUserRepos(system);
        }

        return this.$userGitlabRepos as Observable<any>;
      case 'bitbucket':
        if (!this.$userBitbucketRepos) {
          this.refreshUserRepos(system);
        }

        return this.$userBitbucketRepos as Observable<any>;
    }

    return of([]) as Observable<any>;
  }

  getLoggedInUser() {
    if (!this.$user) {
      this.refreshLoggedInUser();
    }

    return this.$user as Observable<any>;
  }

  refreshLoggedInUser() {
    this.$user = this
      .http
      .get('/api/me')
      .pipe(
        map((user: any) => {
          return user;
        }),
        shareReplay(1)
      );

    // Reset the data$ after the timeout duration to force a new call
    setTimeout(this.resetLoggedInUserCache.bind(this), this.timeoutDuration);

    return this.$user as Observable<any>;
  }

  private resetLoggedInUserCache() {
    this.$user = null;
  }

  private resetUserGithubReposCache() {
    this.$userGithubRepos = null;
  }

  private resetUserGitlabReposCache() {
    this.$userGitlabRepos = null;
  }

  private resetUserBitbucketReposCache() {
    this.$userBitbucketRepos = null;
  }

  refreshUserRepos(system: string) {
    switch (system) {
      case 'github':
        this.$userGithubRepos = this
          .http
          .get(`/api/me/integrations/${ system }/available`)
          .pipe(
            map((repos: any) => {
              return repos;
            }),
            shareReplay(1)
          );

        // Reset the data$ after the timeout duration to force a new call
        setTimeout(this.resetUserGithubReposCache.bind(this), this.timeoutDuration);
        break;
      case 'gitlab':
        this.$userGitlabRepos = this
          .http
          .get(`/api/me/integrations/${ system }/available`)
          .pipe(
            map((repos: any) => {
              return repos;
            }),
            shareReplay(1)
          );

        // Reset the data$ after the timeout duration to force a new call
        setTimeout(this.resetUserGitlabReposCache.bind(this), this.timeoutDuration);
        break;
      case 'bitbucket':
        this.$userBitbucketRepos = this
          .http
          .get(`/api/me/integrations/${ system }/available`)
          .pipe(
            map((repos: any) => {
              return repos;
            }),
            shareReplay(1)
          );

        // Reset the data$ after the timeout duration to force a new call
        setTimeout(this.resetUserBitbucketReposCache.bind(this), this.timeoutDuration);
        break;
    }
  }

  // @Post('install/:repoFullName')
  installWebhookOnRepo(repoFullName: string, system: string) {
    const escapedRepoFullName = encodeURIComponent(repoFullName);

    const url = `/api/me/install/${ system }/${ escapedRepoFullName }`;

    return this
      .http
      .post(url, {})
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  uninstallWebhookOnRepo(repoFullName: string, system: string) {
    const escapedRepoFullName = encodeURIComponent(repoFullName);

    const url = `/api/me/install/${ system }/${ escapedRepoFullName }`;

    return this
      .http
      .delete(url, {})
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
