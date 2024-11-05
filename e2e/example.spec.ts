import { expect, test } from '@playwright/test';

test('achievibit test', async ({ page }) => {
  await page.goto('http://localhost:10101');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/achievibit/);

  await expect(page.getByRole('heading', { name: 'achievibit' })).toBeVisible();
});

test('login with github', async ({ page }) => {
  await page.goto('http://localhost:10101');

  // Click the login with github button.
  await page.getByRole('link', { name: 'Login with GitHub' }).click();

  // expect to be redirected to github login page
  await expect(page).toHaveURL(/github/);
  await expect(page.getByText('Sign in to GitHub to continue')).toBeVisible();
});

test('login with gitlab', async ({ page }) => {
  await page.goto('http://localhost:10101');

  // Click the login with gitlab button.
  await page.getByRole('link', { name: 'Login with GitLab' }).click();

  // expect to be redirected to gitlab login page
  await expect(page).toHaveURL(/gitlab/);
  await expect(page.getByRole('heading', { name: 'Verify you are human by' })).toBeVisible();
});

test('login with bitbucket', async ({ page }) => {
  await page.goto('http://localhost:10101');

  // Click the login with bitbucket button.
  await page.getByRole('link', { name: 'Login with Bitbucket' }).click();

  // expect to be redirected to bitbucket login page
  await expect(page).toHaveURL(/bitbucket/);
  await expect(page.getByTestId('username')).toBeVisible();
});
