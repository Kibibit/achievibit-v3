import { WebhookEvent } from '@octokit/webhooks-types';


export class GitHubWebhookEvent<T extends WebhookEvent> {
  event: string;
  payload: Partial<T>;
}
