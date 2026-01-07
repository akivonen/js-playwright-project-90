import { test, expect } from '@playwright/test';
import LoginPage from '../models/LoginPage';
import { validUserCredentials } from '../loginData';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test('renders the login form on page load', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('logs in successfully and displays dashboard', async () => {
    await loginPage.login(validUserCredentials);
    await expect(loginPage.dashboardWelcomeMessage).toBeVisible();
  });

  test('logs out successfully and returns to login form', async () => {
    await loginPage.login(validUserCredentials);
    await loginPage.logout();

    await expect(loginPage.dashboardWelcomeMessage).not.toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
