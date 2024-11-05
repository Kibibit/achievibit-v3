export class GitHubEvent {
  constructor(
    public readonly eventType: string,
    public readonly body: Record<string, any>
  ) {}

  get isInstallationCreated() {
    return this.eventType === 'installation' && this.body.action === 'created';
  }

  get isInstallationDeleted() {
    return this.eventType === 'installation' && this.body.action === 'deleted';
  }

  get isInstallationRepositoriesAdded() {
    return this.eventType === 'installation_repositories' && this.body.action === 'added';
  }

  get isInstallationRepositoriesRemoved() {
    return this.eventType === 'installation_repositories' && this.body.action === 'removed';
  }

  get isPush() {
    return this.eventType === 'push';
  }

  get isPullRequest() {
    return this.eventType === 'pull_request';
  }

  get isPullRequestReview() {
    return this.eventType === 'pull_request_review';
  }

  get isPullRequestReviewComment() {
    return this.eventType === 'pull_request_review_comment';
  }
}
