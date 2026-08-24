import { test, expect } from '@playwright/test';
import { login, expectHealthyPage } from './fixtures';

test.describe('Export laporan lengkap', () => {
  test('PDF export button is present and enabled', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/laporan');
    await expectHealthyPage(page);
    const pdfBtn = page.getByRole('button', { name: /pdf/i }).first();
    await expect(pdfBtn).toBeEnabled();
  });

  test('Excel export button is present and enabled', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/laporan');
    await expectHealthyPage(page);
    const excelBtn = page.getByRole('button', { name: /excel|xlsx|spreadsheet/i }).first();
    await expect(excelBtn).toBeEnabled();
  });

  test('Word export button is present and enabled', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/laporan');
    await expectHealthyPage(page);
    const wordBtn = page.getByRole('button', { name: /word|docx|document/i }).first();
    await expect(wordBtn).toBeEnabled();
  });
});

test.describe('Per-tabel page', () => {
  test('Tabel page renders for OPERATOR', async ({ page }) => {
    await login(page, 'OPERATOR');
    await page.goto('/lkps/bab-1/tabel-1a2');
    await expectHealthyPage(page);
  });
});