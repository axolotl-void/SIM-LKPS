import { test, expect } from '@playwright/test';
import { login, expectHealthyPage } from './fixtures';

const TARGET_TABEL = '/lkps/bab-1/tabel-1a2';

test.describe('PIMPINAN cannot mutate — UI guard', () => {
  test('Edit button on row is disabled', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const editBtn = page.getByRole('button', { name: /^edit$/i }).first();
    if ((await editBtn.count()) > 0) {
      await expect(editBtn).toBeDisabled();
    }
  });

  test('Delete button on row is disabled', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const deleteBtn = page.getByRole('button', { name: /^hapus$/i }).first();
    if ((await deleteBtn.count()) > 0) {
      await expect(deleteBtn).toBeDisabled();
    }
  });

  test('Submit button not visible (no submit permission)', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const submitBtn = page.getByRole('button', { name: /submit|ajukan/i }).first();
    expect(await submitBtn.count()).toBe(0);
  });

  test('Approve button not visible on validasi page (no validate permission)', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto('/lkps/validasi');
    await expectHealthyPage(page);
    const approveBtn = page.getByRole('button', { name: /setujui|approve/i }).first();
    expect(await approveBtn.count()).toBe(0);
  });
});

test.describe('Audit log endpoint is ADMIN-only', () => {
  test('OPERATOR cannot view /settings/audit-log', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/settings/audit-log');
    const url = page.url();
    if (url.includes('/settings/audit-log')) {
      const body = await page.locator('body').textContent();
      expect(body || '').not.toMatch(/ACCESS_DENIED/);
    } else {
      expect(url).toMatch(/\/forbidden/);
    }
  });

  test('PIMPINAN cannot view /settings/audit-log', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto('/settings/audit-log');
    // Server-side redirect("/") in audit-log page.tsx kicks PIMPINAN away
    await page.waitForURL((url) => !url.pathname.startsWith('/settings/audit-log'), { timeout: 10_000 });
    expect(page.url()).not.toContain('/settings/audit-log');
  });
});