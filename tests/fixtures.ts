import { Page, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROLES = {
  ADMIN: { email: 'admin@ubbg.ac.id', password: 'Admin@2026!' },
  OPERATOR: { email: 'operator@ubbg.ac.id', password: 'Operator@2026!' },
  PIMPINAN: { email: 'pimpinan@ubbg.ac.id', password: 'Pimpinan@2026!' },
} as const;

export type RoleKey = keyof typeof ROLES;

export const STORAGE_BY_ROLE: Record<RoleKey, string> = {
  ADMIN: path.join(__dirname, '.auth', 'admin.json'),
  OPERATOR: path.join(__dirname, '.auth', 'operator.json'),
  PIMPINAN: path.join(__dirname, '.auth', 'pimpinan.json'),
};

/**
 * Login via UI and wait for redirect to dashboard.
 */
export async function login(page: Page, role: RoleKey): Promise<void> {
  const { email, password } = ROLES[role];
  // Clear any leaked session/cookies from prior test in this worker
  await page.context().clearCookies();
  try {
    await page.evaluate(() => {
      window.sessionStorage.clear();
      window.localStorage.clear();
    });
  } catch {
    /* navigated pages may refuse storage access — safe to ignore */
  }
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Auth.js redirects server-side; wait until URL leaves /login
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20_000 });
}

/**
 * Quick health check: page renders, no Next.js error overlay.
 */
export async function expectHealthyPage(page: Page): Promise<void> {
  await expect(page.locator('body')).toBeVisible();
  // nextjs-portal exists unconditionally in dev mode; only fail when actually open
  const errorOverlay = page.locator('nextjs-portal[open]');
  await expect(errorOverlay).toHaveCount(0);
}