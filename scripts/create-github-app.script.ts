import { resolve } from 'path';

import { ensureDirSync, writeFileSync } from 'fs-extra';
import waitForUserInput from 'wait-for-user-input';
import { chromium } from '@playwright/test';

(async () => {
  const username = 'thatkookooguy';
  const baseUrl = 'http://localhost:10101';
  const homepageUrl = baseUrl;
  const postInstallUrl = `${ baseUrl }/api/me/github/post-install`;
  const webhookUrl = `${ baseUrl }/api/webhooks/github`;
  // tell user that github will open and they need to login.
  // after login, they need to press enter to continue in the terminal
  console.log('After pressing enter, a browser window will open to github.com');
  console.log('Please login and press enter again to continue');

  await waitForUserInput('press any key to continue');

  // open browser
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    // Required for running inside containers
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(240000);

  await page.goto('https://github.com/login');

  await waitForUserInput('press any key to continue');

  await page.goto('https://github.com/');
  await page.getByLabel('Open user navigation menu').click();
  await page.getByLabel('Settings').click();
  await page.getByRole('link', { name: 'Developer settings' }).click();
  await page.getByRole('link', { name: 'GitHub Apps' }).click();
  await page.getByRole('link', { name: 'New GitHub App' }).click();

  await page.getByLabel('GitHub App name').fill(`${ username }-achievibit-dev-app`);
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

  // click on create github app
  // GET client id from the page
  const clientId = '';
  // click on generate new client secret
  // GET client secret from the page
  const clientSecret = '';
  // click on update application
  // create a private key and download it
  // save the private key to a file
  const privateKey = 'test';

  await browser.close();

  console.log('clientId:', clientId);
  console.log('clientSecret:', clientSecret);
  console.log('postInstallUrl:', postInstallUrl);
  console.log('webhookUrl:', webhookUrl);
  // make sure the keys directory exists under the project root
  ensureDirSync(resolve(__dirname, '..', 'keys'));
  writeFileSync(resolve(__dirname, '..', 'keys', 'private-key.pem'), privateKey);
  console.log('private key saved to private-key.pem');

  process.exit(0);
})();
