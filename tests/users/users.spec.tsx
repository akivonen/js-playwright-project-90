import { test, expect } from '@playwright/test';
import UsersPage from '../models/UsersPage';
import { newUser, editedUser } from '../fixtures/usersData';
import LoginPage from '../models/LoginPage';
import { validUserCredentials } from '../fixtures/authData';
import { initUsersList } from '../fixtures/initUsersList';

test.describe('Users Page tests', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.login(validUserCredentials);
    usersPage = new UsersPage(page);
    await usersPage.navigateTo();
  });

  test.describe('Creating new user', () => {
    test('renders users page and create user form properly', async () => {
      await expect(usersPage.createButton).toBeVisible();
      await usersPage.createButton.click();

      await expect(usersPage.emailInput).toBeVisible();
      await expect(usersPage.firstNameInput).toBeVisible();
      await expect(usersPage.lastNameInput).toBeVisible();
    });

    test('creates a new user and display created user details properly', async () => {
      await usersPage.createButton.click();
      await usersPage.createUser(newUser);
      await expect(usersPage.showDetailsButton).toBeVisible();

      await usersPage.showDetailsButton.click();
      await usersPage.expectUserDetailsVisible(newUser);
    });
  });

  test.describe('Users list view', () => {
    test('should render all cols in table properly', async () => {
      await usersPage.expectTableHeaderVisible();
    });
    test('should render proper number of rows with main info', async () => {
      await usersPage.expectUsersMainInfoVisible(initUsersList);
    });
  });

  test.describe('Editing existing user with correct data', () => {
    test('displays user edit form properly', async () => {
      const existingUser = initUsersList[0];
      const existingUserRow = await usersPage.getRowByText(existingUser.email);
      await existingUserRow.click();
      await expect(usersPage.emailInput).toBeVisible();
      await expect(usersPage.emailInput).toHaveValue(existingUser.email);
      await expect(usersPage.firstNameInput).toBeVisible();
      await expect(usersPage.firstNameInput).toHaveValue(
        existingUser.firstName,
      );
      await expect(usersPage.lastNameInput).toBeVisible();
      await expect(usersPage.lastNameInput).toHaveValue(existingUser.lastName);
      await expect(usersPage.saveButton).toBeVisible();
      await expect(usersPage.deleteButton).toBeVisible();
    });
    test('handles user data changes and save changes', async () => {
      const existingUser = initUsersList[0];
      const existingUserRow = await usersPage.getRowByText(existingUser.email);
      await existingUserRow.click();
      await usersPage.firstNameInput.fill(editedUser.firstName);
      await usersPage.lastNameInput.fill(editedUser.lastName);
      await usersPage.emailInput.fill(editedUser.email);
      await usersPage.saveButton.click();

      const editedUserRow = await usersPage.getRowByText(editedUser.email);
      await expect(editedUserRow).toBeVisible();
      await expect(editedUserRow).toContainText(editedUser.firstName);
      await expect(editedUserRow).toContainText(editedUser.lastName);
    });
  });
  test.describe('Editing existing user with incorrect data', () => {
    test.beforeEach(async () => {
      const existingUser = initUsersList[1];
      const existingUserRow = await usersPage.getRowByText(existingUser.email);
      await existingUserRow.click();
    });
    test('displays validation error on incorrect email input', async () => {
      await usersPage.testFieldValidation(
        usersPage.emailInput,
        'notAnEmail',
        'Incorrect email format',
      );
    });
    test('displays validation error on empty string input on fields', async () => {
      for (const field of [
        usersPage.emailInput,
        usersPage.firstNameInput,
        usersPage.lastNameInput,
      ]) {
        await usersPage.testFieldValidation(field, '', 'Required');
      }
    });
  });
  test.describe('Deleting user', () => {
    test('deletes multiple users from list', async () => {
      const usersToDelete = initUsersList.slice(0, 2);
      for (const user of usersToDelete) {
        const userRow = await usersPage.getRowByText(user.email);

        await expect(userRow).toBeVisible();
        const deleteCheckbox = userRow.getByLabel('Select this row');
        await deleteCheckbox.click();
      }
      await expect(usersPage.deleteButton).toBeVisible();
      await usersPage.deleteButton.click();

      for (const user of usersToDelete) {
        const userRow = await usersPage.getRowByText(user.email);
        await expect(userRow).not.toBeVisible();
      }
    });

    test('deletes user in edit user form', async () => {
      const user = initUsersList[2];
      const userRow = await usersPage.getRowByText(user.email);
      await expect(userRow).toBeVisible();
      await userRow.click();

      await expect(usersPage.deleteButton).toBeVisible();
      await usersPage.deleteButton.click();
      await expect(userRow).not.toBeVisible();
    });

    test('handles mass deletion of all users', async () => {
      const selectAllCheckbox = usersPage.table.getByLabel('Select all');
      await selectAllCheckbox.click();
      for (const user of initUsersList) {
        const userRow = await usersPage.getRowByText(user.email);
        const checkedCheckbox = userRow.getByTestId('CheckBoxIcon');
        await expect(checkedCheckbox).toBeVisible();
      }
      await usersPage.deleteButton.click();
      for (const user of initUsersList) {
        const userRow = await usersPage.getRowByText(user.email);
        await expect(userRow).not.toBeVisible();
      }
      await expect(usersPage.noUsersText).toBeVisible();
    });
  });
});
