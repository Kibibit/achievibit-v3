import { GitlabWebhookGuard } from './gitlab-webhook.guard';

describe('GitlabWebhookGuard', () => {
  it('should be defined', () => {
    expect(new GitlabWebhookGuard()).toBeDefined();
  });
});
