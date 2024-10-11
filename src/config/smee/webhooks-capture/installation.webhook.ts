import { WebhookEvent } from '@octokit/webhooks-types';

import { GitHubWebhookEvent } from './github-webhook-mock.type';


export const installationWebhookEvent: GitHubWebhookEvent<WebhookEvent> = {
  event: 'installation',
  payload: {
    action: 'created',
    installation: {
      id: 55520704,
      // client_id: 'Iv1.3642c78bd828f5b1',
      account: {
        login: 'Kibibit',
        id: 14274940,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjE0Mjc0OTQw',
        avatar_url: 'https://avatars.githubusercontent.com/u/14274940?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Kibibit',
        html_url: 'https://github.com/Kibibit',
        followers_url: 'https://api.github.com/users/Kibibit/followers',
        following_url: 'https://api.github.com/users/Kibibit/following{/other_user}',
        gists_url: 'https://api.github.com/users/Kibibit/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/Kibibit/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Kibibit/subscriptions',
        organizations_url: 'https://api.github.com/users/Kibibit/orgs',
        repos_url: 'https://api.github.com/users/Kibibit/repos',
        events_url: 'https://api.github.com/users/Kibibit/events{/privacy}',
        received_events_url: 'https://api.github.com/users/Kibibit/received_events',
        type: 'Organization',
        site_admin: false
      },
      repository_selection: 'selected',
      access_tokens_url: 'https://api.github.com/app/installations/55520704/access_tokens',
      repositories_url: 'https://api.github.com/installation/repositories',
      html_url: 'https://github.com/organizations/Kibibit/settings/installations/55520704',
      app_id: 113138,
      app_slug: 'achievibit-beta',
      target_id: 14274940,
      target_type: 'Organization',
      permissions: {
        members: 'read',
        metadata: 'read',
        pull_requests: 'write',
        repository_hooks: 'write',
        statuses: 'write',
        vulnerability_alerts: 'read'
      },
      events: [
        'pull_request',
        'pull_request_review',
        'pull_request_review_comment'
      ],
      created_at: '2024-10-02T15:53:42.000+03:00',
      updated_at: '2024-10-02T15:53:42.000+03:00',
      single_file_name: null,
      has_multiple_single_files: false,
      single_file_paths: [],
      suspended_by: null,
      suspended_at: null
    },
    repositories: [
      {
        id: 129172366,
        node_id: 'MDEwOlJlcG9zaXRvcnkxMjkxNzIzNjY=',
        name: '2FA',
        full_name: 'Kibibit/2FA',
        private: false
      }
    ],
    requester: undefined,
    sender: {
      login: 'thatkookooguy',
      id: 10427304,
      node_id: 'MDQ6VXNlcjEwNDI3MzA0',
      avatar_url: 'https://avatars.githubusercontent.com/u/10427304?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/thatkookooguy',
      html_url: 'https://github.com/thatkookooguy',
      followers_url: 'https://api.github.com/users/thatkookooguy/followers',
      following_url: 'https://api.github.com/users/thatkookooguy/following{/other_user}',
      gists_url: 'https://api.github.com/users/thatkookooguy/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/thatkookooguy/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/thatkookooguy/subscriptions',
      organizations_url: 'https://api.github.com/users/thatkookooguy/orgs',
      repos_url: 'https://api.github.com/users/thatkookooguy/repos',
      events_url: 'https://api.github.com/users/thatkookooguy/events{/privacy}',
      received_events_url: 'https://api.github.com/users/thatkookooguy/received_events',
      type: 'User',
      site_admin: false
    }
  }
};
