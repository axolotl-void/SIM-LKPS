import { test, expect } from '@playwright/test';
import { login, expectHealthyPage } from './fixtures';

/**
 * Permission matrix — verifies client-side UI matches role.
 * Login inline per test (simpler, deterministic, no cross-file imports).
 */

const TARGET_TABEL = '/lkps/bab-1/tabel-1a2';

test.describe('Permission matrix — ADMIN', () => {
  test('ADMIN: Tambah row button is enabled', async ({ page }) => {
    await login(page, 'ADMIN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const tambahBtn = page.getByRole('button', { name: /tambah/i }).first();
    await expect(tambahBtn).toBeEnabled();
  });
});

test.describe('Permission matrix — OPERATOR', () => {
  test('OPERATOR on DRAFT: Tambah row button enabled', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const tambahBtn = page.getByRole('button', { name: /tambah/i }).first();
    await expect(tambahBtn).toBeEnabled();
  });

  test('OPERATOR cannot access /settings/users', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/settings/users');
    await expect(page).toHaveURL(/\/forbidden|\/settings\/users/);
    if (page.url().includes('/settings/users')) {
      const body = await page.locator('body').textContent();
      expect(body || '').not.toMatch(/tambah user|create user/i);
    }
  });
});

test.describe('Permission matrix — PIMPINAN is read-only', () => {
  test('PIMPINAN: Tambah row button is disabled', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const tambahBtn = page.getByRole('button', { name: /tambah/i }).first();
    if (await tambahBtn.count() > 0) {
      await expect(tambahBtn).toBeDisabled();
    }
  });

  test('PIMPINAN: export menu accessible', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto('/laporan');
    await expectHealthyPage(page);
    const exportPdf = page.getByRole('button', { name: /pdf/i }).first();
    await expect(exportPdf).toBeEnabled();
  });

  test('PIMPINAN cannot mutate master data', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto('/master/dosen');
    await expectHealthyPage(page);
    const tambahBtn = page.getByRole('button', { name: /tambah/i }).first();
    if (await tambahBtn.count() > 0) {
      await expect(tambahBtn).toBeDisabled();
    }
  });
});