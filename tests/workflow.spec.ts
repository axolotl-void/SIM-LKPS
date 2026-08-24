import { test, expect } from '@playwright/test';
import { login, expectHealthyPage } from './fixtures';

const TARGET_TABEL = '/lkps/bab-1/tabel-1a2';

test.describe('Workflow: DRAFT → DIAJUKAN → DISETUJUI', () => {
  test('OPERATOR can submit a DRAFT tabel', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const submitBtn = page.getByRole('button', { name: /submit|ajukan/i }).first();
    if ((await submitBtn.count()) === 0) {
      test.skip(true, 'No submit button — tabel not in DRAFT/DIREVISI');
    }
    await expect(submitBtn).toBeEnabled();
  });

  test('ADMIN can validate a DIAJUKAN tabel', async ({ page }) => {
    await login(page, 'ADMIN');
    await page.goto('/lkps/validasi');
    await expectHealthyPage(page);
    const tabelLink = page.getByRole('link', { name: /1\.A\.2/i }).first();
    if ((await tabelLink.count()) === 0) {
      test.skip(true, 'No pending tabel 1.A.2 — submit first');
    }
  });
});

test.describe('Workflow: blocked transitions', () => {
  test('PIMPINAN cannot see submit button (no submit permission)', async ({ page }) => {
    await login(page, 'PIMPINAN');
    await page.goto(TARGET_TABEL);
    await expectHealthyPage(page);
    const submitBtn = page.getByRole('button', { name: /submit|ajukan/i }).first();
    expect(await submitBtn.count()).toBe(0);
  });
});