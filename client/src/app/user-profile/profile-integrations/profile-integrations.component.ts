import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'kb-profile-integrations',
  standalone: true,
  imports: [ NgIf, AsyncPipe, NgFor ],
  templateUrl: './profile-integrations.component.html',
  styleUrl: './profile-integrations.component.scss'
})
export class ProfileIntegrationsComponent implements OnInit {
  private readonly dataKey = 'user';
  user: any;
  userGithubRepos: any[] = [];
  userGitlabRepos: any[] = [];
  userBitbucketRepos: any[] = [];
  isLoading = true;
  activeIntegrationsTab = 'github';

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.data[this.dataKey];
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
