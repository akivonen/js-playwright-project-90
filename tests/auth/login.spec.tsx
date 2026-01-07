import { test, expect } from '@playwright/test';
import LoginPage from '../models/LoginPage';
import { testUser1 } from '../loginData';

test('should render App loginPage properly', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});

test('should login properly and render dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(testUser1);

  await expect(page.getByText('Welcome to the administration')).toBeVisible();
});

test('should logout properly and render loginPage', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(testUser1);
  await loginPage.logout();

  await expect(
    page.getByText('Welcome to the administration')
  ).not.toBeVisible();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});
