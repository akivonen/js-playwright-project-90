import BasePage from './BasePage';
import { Locator, Page } from '@playwright/test';
import { UserCredentials } from '../types';

export default class LoginPage extends BasePage {
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signInButton: Locator;
  public readonly userProfileButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.userProfileButton = page.getByRole('button', { name: 'Profile' });
  }

  async login(credentials: UserCredentials) {
    const { username, password } = credentials;

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async logout() {
    await this.userProfileButton.click();

    const logoutButton = this.page.getByRole('menuitem', { name: 'Logout' });
    await logoutButton.click();
  }
}
