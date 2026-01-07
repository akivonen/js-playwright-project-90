import BasePage from './BasePage';
import { Locator, Page } from '@playwright/test';
import { UserCredentials } from '../types';

export default class LoginPage extends BasePage {
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  public readonly userProfileButton: Locator;
  public readonly dashboardWelcomeMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.userProfileButton = page.getByRole('button', { name: 'Profile' });
    this.dashboardWelcomeMessage = page.getByText(
      'Welcome to the administration'
    );
  }

  async login(credentials: UserCredentials) {
    const { username, password } = credentials;
    await this.usernameInput.isVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.isVisible();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.userProfileButton.isVisible();
    await this.userProfileButton.click();
    const logoutButton = this.page.getByRole('menuitem', { name: 'Logout' });
    await logoutButton.click();
  }
}
