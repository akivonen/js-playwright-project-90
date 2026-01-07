import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import { CreateUserData, User } from '../types';

export default class UsersPage extends BasePage {
  public readonly createButton: Locator;
  public readonly emailInput: Locator;
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly saveButton: Locator;
  public readonly deleteButton: Locator;
  public readonly showUserDetailsButton: Locator;
  public readonly usersTable: Locator;
  public readonly usersTableColumns: string[];
  public readonly usersTableRows: Locator;
  public readonly alertMsg: Locator;
  public readonly noUsersText: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = this.page.getByRole('link', { name: 'Create' });
    this.emailInput = this.page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = this.page.getByRole('textbox', {
      name: 'First Name',
    });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    this.showUserDetailsButton = this.page.getByRole('link', { name: 'Show' });
    this.usersTable = this.page.getByRole('table');
    this.usersTableColumns = [
      'Id',
      'Email',
      'First name',
      'Last name',
      'Created at',
    ];
    this.usersTableRows = this.usersTable.locator('tbody tr');
    this.alertMsg = this.page.getByRole('alert');
    this.noUsersText = this.page.getByText('No Users yet.');
  }

  async openPage() {
    await super.goto('users');
  }

  async createUser(newUser: CreateUserData) {
    const { email, firstName, lastName } = newUser;
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
    await expect(this.lastNameInput).toBeVisible();
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }

  async getRowByText(text: string) {
    return this.usersTableRows.filter({ hasText: text });
  }

  async testFieldValidation(field: Locator, input: string, errMsg: string) {
    const fieldValue = await field.inputValue();
    await field.fill(input);
    await this.saveButton.click();
    await expect(this.alertMsg).toBeVisible();
    await expect(this.alertMsg).toHaveText(
      'The form is not valid. Please check for errors'
    );
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAttribute('aria-describedby');
    const helperTextId = await field.getAttribute('aria-describedby');
    const errorMessage = await this.page.locator(`[id="${helperTextId}"]`);

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(errMsg);
    await field.fill(fieldValue);
  }

  async expectUserDetailsVisible(user: CreateUserData) {
    await expect(
      this.page.getByText(user.email, { exact: true })
    ).toBeVisible();
    await expect(
      this.page.getByText(user.firstName, { exact: true })
    ).toBeVisible();
    await expect(
      this.page.getByText(user.lastName, { exact: true })
    ).toBeVisible();
  }

  async expectUsersTableHeaderVisible() {
    await expect(this.usersTable).toBeVisible();
    const headerCells = this.usersTable.getByRole('columnheader');
    await expect(headerCells).toHaveCount(6);

    const selectAllCheckbox = headerCells.getByLabel('Select all');
    await expect(selectAllCheckbox).toBeVisible();

    const headersWithText = headerCells.filter({ hasText: /\w+/ });
    await expect(headersWithText).toHaveText(this.usersTableColumns);
  }

  async expectUsersMainInfoVisible(users: User[]) {
    await expect(this.usersTableRows).toHaveCount(users.length);

    for (const user of users) {
      const row = await this.getRowByText(user.email);

      await expect(row).toBeVisible();
      await expect(row).toContainText(String(user.id));
      await expect(row).toContainText(user.firstName);
      await expect(row).toContainText(user.lastName);
    }
  }
}
