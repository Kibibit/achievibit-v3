import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { combineLatest } from 'rxjs';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgFor],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  userGithubRepos: any[] = [];
  userGitlabRepos: any[] = [];
  userBitbucketRepos: any[] = [];
  activeTab = 'overview';
  activeIntegrationsTab = 'github';
  user: any;

  isLoading = true;

  constructor(
    private readonly userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    const loggedInUserObs = this
      .userProfileService
      .getLoggedInUser();

    const userGithubReposObs = this
      .userProfileService
      .getUserRepos('github');

    const userGitlabReposObs = this
      .userProfileService
      .getUserRepos('gitlab');

    const userBitbucketReposObs = this
      .userProfileService
      .getUserRepos('bitbucket');

    loggedInUserObs
      .subscribe((user) => {
        this.user = user;

        this.checkIfAllDataLoaded();
      });

    userGithubReposObs
      .subscribe((repos) => {
        this.userGithubRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });

    userGitlabReposObs
      .subscribe((repos) => {
        this.userGitlabRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });

    userBitbucketReposObs
      .subscribe((repos) => {
        this.userBitbucketRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });

    // Combine the two observables to get the user and their repos
    // combineLatest([
    //   loggedInUserObs,
    //   userGithubReposObs,
    //   userGitlabReposObs,
    //   userBitbucketReposObs
    // ])
    //   .subscribe(([
    //     user,
    //     githubRepos,
    //     gitlabRepos,
    //     bitbucketRepos
    //   ]) => {
    //     this.user = user;
    //     this.userGithubRepos = githubRepos as any[];
    //     this.userGitlabRepos = gitlabRepos as any[];
    //     this.userBitbucketRepos = bitbucketRepos as any[];
    //   });
  }

  installWebhookOnRepo(repoFullName: string, system: string) {
    this.userProfileService.installWebhookOnRepo(repoFullName, system)
    .subscribe((result) => {
      console.log('Webhook installed on repo', result);
    });
  }

  uninstallWebhookOnRepo(repoFullName: string, system: string) {
    this.userProfileService.uninstallWebhookOnRepo(repoFullName, system)
    .subscribe((result) => {
      console.log('Webhook uninstalled from repo', result);
    });
  }

  installGithubApp() {
    this.userProfileService.installGithubApp();
  }

  private checkIfAllDataLoaded() {
    if (this.user && this.userGithubRepos && this.userGitlabRepos && this.userBitbucketRepos) {
      this.isLoading = false;
    }
  }
}
