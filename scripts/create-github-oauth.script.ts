import waitForUserInput from 'wait-for-user-input';
import { chromium } from '@playwright/test';

(async () => {
  const username = 'thatkookooguy';
  const baseUrl = 'http://localhost:10101';
  const homepageUrl = baseUrl;
  const callbackUrl = `${ baseUrl }/api/auth/github/callback`;
  // tell user that github will open and they need to login.
  // after login, they need to press enter to continue in the terminal
  console.log('After pressing enter, a browser window will open to github.com');
  console.log('Please login and press enter again to continue');

  await waitForUserInput('press any key to continue');

  // open browser
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(240000);

  await page.goto('https://github.com/login');

  await waitForUserInput('press any key to continue');

  await page.goto('https://github.com/');
  await page.getByLabel('Open user navigation menu').click();
  await page.getByLabel('Settings').click();
  await page.getByRole('link', { name: 'Developer settings' }).click();
  await page.getByRole('link', { name: 'OAuth Apps' }).click();
  await page.getByRole('link', { name: 'New OAuth App' }).click();
  await page.getByLabel('Application name').click();
  await page.getByLabel('Application name').fill(`${ username }-achievibit-dev-oauth`);
  await page.getByLabel('Homepage URL').click();
  await page.getByLabel('Homepage URL').fill(homepageUrl);
  await page.getByLabel('Authorization callback URL').fill(callbackUrl);
  await page.getByRole('button', { name: 'Register application' }).click();
  const clientId = await page.locator('code').textContent();
  await page.getByRole('button', { name: 'Generate a new client secret' }).click();
  const clientSecret = await page.locator('code#new-oauth-token').textContent();
  await page.getByRole('button', { name: 'Update application' }).click();

  await browser.close();

  console.log('clientId:', clientId);
  console.log('clientSecret:', clientSecret);
  console.log('callbackUrl:', callbackUrl);

  process.exit(0);
})();
