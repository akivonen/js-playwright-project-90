import { Locator, Page, expect } from '@playwright/test';
import { CreateUserData, User } from '../types';
import TablePage from './TablePage';
import { usersPageUrl, usersTableColumns } from '../fixtures/usersData';

export default class UsersPage extends TablePage {
  public readonly emailInput: Locator;
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly noUsersText: Locator;

  constructor(page: Page) {
    super(page, usersPageUrl, usersTableColumns);

    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = this.page.getByRole('textbox', {
      name: 'First Name',
    });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
    this.noUsersText = this.page.getByText('No Users yet.');
  }

  async createUser(newUser: CreateUserData) {
    const { email, firstName, lastName } = newUser;
    await this.emailInput.isVisible();
    await this.emailInput.fill(email);
    await this.firstNameInput.isVisible();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.isVisible();
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async expectUserDetailsVisible(user: CreateUserData) {
    await expect(
      this.page.getByText(user.email, { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText(user.firstName, { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText(user.lastName, { exact: true }),
    ).toBeVisible();
  }

  async expectUsersMainInfoVisible(users: User[]) {
    await expect(this.tableRows).toHaveCount(users.length);

    for (const user of users) {
      const row = await this.getRowByText(user.email);

      await expect(row).toBeVisible();
      await expect(row).toContainText(String(user.id));
      await expect(row).toContainText(user.firstName);
      await expect(row).toContainText(user.lastName);
    }
  }
}
