import { test, expect } from '@playwright/test';

test('should render App loginPage properly', async ({ page }) => {
  page.goto('http://localhost:5173');

  const username = page.getByRole('textbox', { name: /username/i });
  const password = page.getByRole('textbox', { name: /password/i });
  const button = page.getByRole('button', { name: /sign in/i });

  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
  await expect(button).toBeVisible();
});
