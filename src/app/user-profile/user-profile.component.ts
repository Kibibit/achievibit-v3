import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'kb-user-profile',
  standalone: true,
  imports: [ NgIf, NgFor ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
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
    this.getProfileInfo();
    this.getGithubRepos();
    this.getGitlabRepos();
    this.getBitbucketRepos();
  }

  getBitbucketRepos() {
    return this
      .userProfileService
      .getUserRepos('bitbucket')
      .subscribe((repos) => {
        this.userBitbucketRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });
  }

  getGitlabRepos() {
    return this
      .userProfileService
      .getUserRepos('gitlab')
      .subscribe((repos) => {
        this.userGitlabRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });
  }

  getGithubRepos() {
    return this
      .userProfileService
      .getUserRepos('github')
      .subscribe((repos) => {
        this.userGithubRepos = repos as any[];

        this.checkIfAllDataLoaded();
      });
  }

  getProfileInfo() {
    return this
      .userProfileService
      .getLoggedInUser()
      .subscribe((user) => {
        this.user = user;

        this.checkIfAllDataLoaded();
      });
  }

  installWebhookOnRepo(repoFullName: string, system: string) {
    this.userProfileService.installWebhookOnRepo(repoFullName, system)
      .subscribe((result) => {
        console.log('Webhook installed on repo', result);

        // refresh the repos
        if (system === 'github') {
          return this.getGithubRepos();
        }

        if (system === 'gitlab') {
          return this.getGitlabRepos();
        }

        if (system === 'bitbucket') {
          return this.getBitbucketRepos();
        }

        return;
      });
  }

  uninstallWebhookOnRepo(repoFullName: string, system: string) {
    this.userProfileService.uninstallWebhookOnRepo(repoFullName, system)
      .subscribe((result) => {
        console.log('Webhook uninstalled from repo', result);

        // refresh the repos
        if (system === 'github') {
          return this.getGithubRepos();
        }

        if (system === 'gitlab') {
          return this.getGitlabRepos();
        }

        if (system === 'bitbucket') {
          return this.getBitbucketRepos();
        }

        return;
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
