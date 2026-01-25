import { Locator, Page, expect } from '@playwright/test';
import { TaskStatus, CreateTaskStatusData, User } from '../types';
import TablePage from './TablePage';
import {
  taskStatusPageUrl,
  taskStatusesTableColumns,
} from '../fixtures/taskStatusesData';

export default class TaskStatusesPage extends TablePage {
  public readonly nameInput: Locator;
  public readonly slugInput: Locator;
  public readonly noTaskStatusesText: Locator;

  constructor(page: Page) {
    super(page, taskStatusPageUrl, taskStatusesTableColumns);

    this.nameInput = this.page.getByRole('textbox', { name: 'Name' });
    this.slugInput = this.page.getByRole('textbox', {
      name: 'Slug',
    });
    this.noTaskStatusesText = this.page.getByText('No Task statuses yet.');
  }

  async createTaskStatus(newTaskStatus: CreateTaskStatusData) {
    const { name, slug } = newTaskStatus;
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await expect(this.slugInput).toBeVisible();
    await this.slugInput.fill(slug);
    await this.saveButton.click();
  }

  async expectTaskStatusDetailsVisible(taskStatus: CreateTaskStatusData) {
    await expect(
      this.page.getByText(taskStatus.name, { exact: true }),
    ).toBeVisible();
  }

  async expectTaskStatusMainInfoVisible(taskStatuses: TaskStatus[]) {
    await expect(this.tableRows).toHaveCount(taskStatuses.length);

    for (const taskStatus of taskStatuses) {
      const row = await this.getRowByText(taskStatus.name);

      await expect(row).toBeVisible();
      await expect(row).toContainText(String(taskStatus.id));
      await expect(row).toContainText(taskStatus.slug);
    }
  }
}
