import { test, expect } from '@playwright/test';
import LoginPage from '../models/LoginPage';
import { validUserCredentials } from '../fixtures/authData';
import {
  newTaskStatus,
  initTaskStatusesList,
  editedTaskStatus,
} from '../fixtures/taskStatusesData';
import TaskStatusesPage from '../models/TaskStatusesPage';

test.describe('TaskStatuses Page tests', () => {
  let taskStatusesPage: TaskStatusesPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login(validUserCredentials);
    taskStatusesPage = new TaskStatusesPage(page);
    await taskStatusesPage.navigateTo();
  });

  test.describe('Creating new task status', () => {
    test('renders task statuses page and create task status form properly', async () => {
      await expect(taskStatusesPage.createButton).toBeVisible();
      await taskStatusesPage.createButton.click();

      await expect(taskStatusesPage.nameInput).toBeVisible();
      await expect(taskStatusesPage.slugInput).toBeVisible();
    });

    test('creates a new task status and display created task status details properly', async () => {
      await taskStatusesPage.createButton.click();
      await taskStatusesPage.createTaskStatus(newTaskStatus);
      await expect(taskStatusesPage.showDetailsButton).toBeVisible();

      await taskStatusesPage.showDetailsButton.click();
      await taskStatusesPage.expectTaskStatusDetailsVisible(newTaskStatus);
    });
  });

  test.describe('Task statuses list view', () => {
    test('should render all cols in table properly', async () => {
      await taskStatusesPage.expectTableHeaderVisible();
    });
    test('should render proper number of rows with main info', async () => {
      await taskStatusesPage.expectTaskStatusMainInfoVisible(
        initTaskStatusesList,
      );
    });
  });

  test.describe('Editing existing task status with correct data', () => {
    test('displays task status edit form properly', async () => {
      const existingTaskStatus = initTaskStatusesList[0];
      const existingTaskStatusRow = await taskStatusesPage.getRowByText(
        existingTaskStatus.name,
      );
      await existingTaskStatusRow.click();
      await expect(taskStatusesPage.nameInput).toBeVisible();
      await expect(taskStatusesPage.nameInput).toHaveValue(
        existingTaskStatus.name,
      );
      await expect(taskStatusesPage.slugInput).toBeVisible();
      await expect(taskStatusesPage.slugInput).toHaveValue(
        existingTaskStatus.slug,
      );
      await expect(taskStatusesPage.saveButton).toBeVisible();
      await expect(taskStatusesPage.deleteButton).toBeVisible();
    });
    test('handles task status data changes and save changes', async () => {
      const existingTaskStatus = initTaskStatusesList[0];
      const existingTaskStatusRow = await taskStatusesPage.getRowByText(
        existingTaskStatus.name,
      );
      await existingTaskStatusRow.click();

      await taskStatusesPage.nameInput.fill(editedTaskStatus.name);
      await taskStatusesPage.slugInput.fill(editedTaskStatus.slug);
      await taskStatusesPage.saveButton.click();

      const editedTaskStatusRow = await taskStatusesPage.getRowByText(
        editedTaskStatus.name,
      );
      await expect(editedTaskStatusRow).toBeVisible();
      await expect(editedTaskStatusRow).toContainText(editedTaskStatus.name);
      await expect(editedTaskStatusRow).toContainText(editedTaskStatus.slug);
    });
  });
  test.describe('Editing existing task status with incorrect data', () => {
    test.beforeEach(async () => {
      const existingTaskStatus = initTaskStatusesList[1];
      const existingTaskStatusRow = await taskStatusesPage.getRowByText(
        existingTaskStatus.name,
      );
      await existingTaskStatusRow.click();
    });
    test('displays validation error on empty string input on fields', async () => {
      for (const field of [
        taskStatusesPage.nameInput,
        taskStatusesPage.slugInput,
      ]) {
        await taskStatusesPage.testFieldValidation(field, '', 'Required');
      }
    });
  });
  test.describe('Deleting task status', () => {
    test('deletes multiple task statuses from list', async () => {
      const taskStatusesToDelete = initTaskStatusesList.slice(0, 2);
      for (const taskStatus of taskStatusesToDelete) {
        const taskStatusRow = await taskStatusesPage.getRowByText(
          taskStatus.name,
        );

        await expect(taskStatusRow).toBeVisible();
        const deleteCheckbox = taskStatusRow.getByLabel('Select this row');
        await deleteCheckbox.click();
      }
      await expect(taskStatusesPage.deleteButton).toBeVisible();
      await taskStatusesPage.deleteButton.click();

      for (const taskStatus of taskStatusesToDelete) {
        const taskStatusRow = await taskStatusesPage.getRowByText(
          taskStatus.name,
        );
        await expect(taskStatusRow).not.toBeVisible();
      }
    });

    test('deletes task status in edit task status form', async () => {
      const taskStatus = initTaskStatusesList[2];
      const taskStatusRow = await taskStatusesPage.getRowByText(
        taskStatus.name,
      );
      await expect(taskStatusRow).toBeVisible();
      await taskStatusRow.click();

      await expect(taskStatusesPage.deleteButton).toBeVisible();
      await taskStatusesPage.deleteButton.click();
      await expect(taskStatusRow).not.toBeVisible();
    });

    test('handles mass deletion of all task statuses', async () => {
      const selectAllCheckbox = taskStatusesPage.table.getByLabel('Select all');
      await selectAllCheckbox.click();
      for (const taskStatus of initTaskStatusesList) {
        const taskStatusRow = await taskStatusesPage.getRowByText(
          taskStatus.name,
        );
        const checkedCheckbox = taskStatusRow.getByTestId('CheckBoxIcon');
        await expect(checkedCheckbox).toBeVisible();
      }
      await taskStatusesPage.deleteButton.click();
      for (const taskStatus of initTaskStatusesList) {
        const taskStatusRow = await taskStatusesPage.getRowByText(
          taskStatus.name,
        );
        await expect(taskStatusRow).not.toBeVisible();
      }
      await expect(taskStatusesPage.noTaskStatusesText).toBeVisible();
    });
  });
});
