import { GithubWebhookGuard } from './github-webhook.guard';

describe('GithubWebhookGuard', () => {
  it('should be defined', () => {
    expect(new GithubWebhookGuard()).toBeDefined();
  });
});
