import { Locator, Page, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class TablePage extends BasePage {
  public pageUrl: string;
  public tableColumns: string[];
  public readonly table: Locator;
  public readonly tableRows: Locator;
  public readonly createButton: Locator;
  public readonly saveButton: Locator;
  public readonly deleteButton: Locator;
  public readonly showDetailsButton: Locator;
  public readonly alertMsg: Locator;

  constructor(page: Page, pageUrl: string, tableColumns: string[]) {
    super(page);
    this.pageUrl = pageUrl;
    this.tableColumns = tableColumns;
    this.table = this.page.getByRole('table');
    this.tableRows = this.table.locator('tbody tr');
    this.createButton = this.page.getByRole('link', { name: 'Create' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    this.showDetailsButton = this.page
      .getByRole('link', { name: 'Show' })
      .first();
    this.alertMsg = this.page.getByRole('alert');
  }

  async navigateTo() {
    await super.navigateTo(this.pageUrl);
    await expect(this.table).toBeVisible();
  }

  async getRowByText(text: string) {
    return this.tableRows.filter({ hasText: text }).first();
  }

  async testFieldValidation(field: Locator, input: string, errMsg: string) {
    const originalValue = await field.inputValue();
    await field.fill(input);
    await this.saveButton.click();
    await expect(this.alertMsg).toBeVisible();
    await expect(this.alertMsg).toHaveText(
      'The form is not valid. Please check for errors',
    );
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAttribute('aria-describedby');
    const helperTextId = await field.getAttribute('aria-describedby');
    if (helperTextId) {
      const errorMessage = await this.page.locator(`[id="${helperTextId}"]`);
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText(errMsg);
    }
    await field.fill(originalValue);
  }

  async expectTableHeaderVisible() {
    await expect(this.table).toBeVisible();
    const headerCells = this.table.getByRole('columnheader');
    await expect(headerCells).toHaveCount(this.tableColumns.length + 1);
    await expect(headerCells.getByLabel('Select all')).toBeVisible();
    await expect(headerCells.filter({ hasText: /\w+/ })).toHaveText(
      this.tableColumns,
    );
  }
}
