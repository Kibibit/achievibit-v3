import { relative, resolve } from 'path';

import { green } from 'colors';
import { ensureDirSync } from 'fs-extra';
import inquirer from 'inquirer';
import { chromium, Page } from '@playwright/test';

(async () => {
  const githubAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your github username'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your github password'
    }
  ]);

  const baseUrl = 'http://localhost:10101';
  const homepageUrl = baseUrl;
  const callbackUrl = `${ baseUrl }/api/auth/github/callback`;
  const postInstallUrl = `${ baseUrl }/api/me/github/post-install`;
  const webhookUrl = getWebhookUrl();
  // tell user that github will open and they need to login.
  // after login, they need to press enter to continue in the terminal
  // console.log('After pressing enter, a browser window will open to github.com');
  // console.log('Please login and press enter again to continue');

  // await waitForUserInput('press any key to continue');

  console.log('Opening browser to github.com');
  // open browser
  const browser = await chromium.launch({
    headless: true,
    // headless: false,
    slowMo: 500,
    // Required for running inside containers
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(120000);

  await page.goto('https://github.com/login');

  await page.getByLabel('Username or email address').fill(githubAnswers.username);
  await page.getByLabel('Password').fill((githubAnswers as any).password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Send a code via SMS' }).click();
  await page.getByRole('button', { name: 'Send SMS' }).click();

  const answers = await inquirer.prompt({
    type: 'input',
    name: 'smsCode',
    message: 'Enter the SMS code sent to your phone'
  });
  await page.getByPlaceholder('XXXXXX').fill(answers.smsCode);

  await page.waitForTimeout(1000);

  try {
    await createGitHubOauthApp(page, githubAnswers, homepageUrl, callbackUrl);

    await createGitHubApp(page, githubAnswers, homepageUrl, postInstallUrl, webhookUrl);
  } catch (error) {
    // save screenshot for debugging
    await page.screenshot({ path: 'error.png' });
  }

  await browser.close();
  process.exit(0);
})();

async function createGitHubOauthApp(
  page: Page,
  githubAnswers: { username: string },
  homepageUrl: string,
  callbackUrl: string
) {
  await page.goto('https://github.com/settings/developers');

  await page.getByRole('link', { name: 'New OAuth App' }).click();
  await page.getByLabel('Application name').click();
  const oauthAppName = `${ githubAnswers.username }-achievibit-dev-oauth`;
  await page.getByLabel('Application name').fill(oauthAppName);
  await page.getByLabel('Homepage URL').click();
  await page.getByLabel('Homepage URL').fill(homepageUrl);
  await page.getByLabel('Authorization callback URL').fill(callbackUrl);
  await page.getByRole('button', { name: 'Register application' }).click();
  const clientId = await page.locator('code').textContent();
  await page.getByRole('button', { name: 'Generate a new client secret' }).click();
  const clientSecret = await page.locator('code#new-oauth-token').textContent();
  await page.getByRole('button', { name: 'Update application' }).click();

  console.log(green('== GitHub OAuth App Details =='));
  console.log('oauthAppName:', oauthAppName);
  console.log('clientId:', clientId);
  console.log('clientSecret:', clientSecret);
  console.log('callbackUrl:', callbackUrl);
  console.log('Edit URL:', 'https://github.com/settings/developers');
}

async function createGitHubApp(
  page: Page,
  githubAnswers: { username: string },
  homepageUrl: string,
  postInstallUrl: string,
  webhookUrl: string
) {
  await page.goto('https://github.com/settings/apps');
  await page.getByRole('link', { name: 'New GitHub App' }).click();

  const githubAppName = `${ githubAnswers.username }-achievibit-dev-app`;
  await page.getByLabel('GitHub App name').fill(githubAppName);
  await page.getByLabel('Homepage URL').fill(homepageUrl);
  await page.getByLabel('Setup URL (optional)').fill(postInstallUrl);
  await page.getByLabel('Webhook URL').fill(webhookUrl);

  // permissions
  await page.getByRole('button', { name: 'Repository permissions' }).click();
  await page.locator('li').filter({ hasText: 'Pull requests' }).getByRole('button').click();
  await page.getByRole('menuitemradio', { name: 'Read-only' }).click();

  await page.getByRole('checkbox', { name: 'Installation target Info A' }).check();
  await page.getByRole('checkbox', { name: 'Meta Info When this App is' }).check();
  await page.getByLabel('Pull request Pull request').check();
  await page.getByLabel('Pull request review Pull').check();
  await page.getByLabel('Pull request review comment').check();
  await page.getByLabel('Pull request review thread A').check();
  await page.getByLabel('Any account').check();

  await page.getByRole('button', { name: 'Create GitHub App' }).click();

  const githubAppId = await page.locator('p').filter({ hasText: 'App ID:' }).textContent();
  const githubAppClientId = await page.locator('p').filter({ hasText: 'Client ID:' }).textContent();
  await page.getByRole('button', { name: 'Generate a new client secret' }).click();
  const githubAppClientSecret = await page.locator('code#new-oauth-token').textContent();

  await page.getByRole('button', { name: 'Save changes' }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate a private key' }).click();
  const download = await downloadPromise;

  console.log(green('== GitHub App Details =='));
  console.log('githubAppName:', githubAppName);
  console.log('githubAppId:', githubAppId);
  console.log('githubAppClientId:', githubAppClientId);
  console.log('githubAppClientSecret:', githubAppClientSecret);
  console.log('postInstallUrl:', postInstallUrl);
  console.log('webhookUrl:', webhookUrl);
  console.log('Edit URL:', `https://github.com/settings/apps/${ githubAppName }`);
  // make sure the keys directory exists under the project root
  const folderPath = resolve(__dirname, '..', 'server', 'keys');
  const filePath = resolve(folderPath, 'private-key.pem');
  ensureDirSync(folderPath);
  await download.saveAs(filePath);
  console.log(`private key saved to ${ relative(process.cwd(), filePath) }`);
}

function getWebhookUrl() {
  const isRunningInGitHubCodespace = process.env.CODESPACES === 'true';
  const codespaceName = process.env.CODESPACE_NAME;
  const codespacePortForwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  const port = '10101';

  if (isRunningInGitHubCodespace) {
    return `https://${ codespaceName }-${ port }.${ codespacePortForwardingDomain }`;
  }

  throw new Error('Webhook URL is not supported outside of GitHub Codespaces');
}
