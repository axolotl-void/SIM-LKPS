import { test, expect } from '@playwright/test';
import { login, ROLES, expectHealthyPage } from './fixtures';

test.describe('Authentication', () => {
  test('redirects unauthenticated user to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('rejects wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ROLES.ADMIN.email);
    await page.fill('input[type="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    // Stay on login, show error
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/email atau kata sandi tidak sesuai/i)).toBeVisible();
  });

  test('login as admin lands on dashboard', async ({ page }) => {
    await login(page, 'ADMIN');
    await expect(page).not.toHaveURL(/\/login/);
    await expectHealthyPage(page);
  });

  test('login as operator lands on dashboard', async ({ page }) => {
    await login(page, 'OPERATOR');
    await expect(page).not.toHaveURL(/\/login/);
    await expectHealthyPage(page);
  });

  test('login as pimpinan lands on dashboard', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await expect(page).not.toHaveURL(/\/login/);
    await expectHealthyPage(page);
  });
});
