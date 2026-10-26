import { test, expect } from '@playwright/test';
import { HOME } from './pages/selectors';

test.describe('Homepage gift-box entry point', () => {
  test('TC-10 mobile shows "Shop Gift Boxes" and it leads to the bundles collection', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only entry point');
    await page.goto('/');
    const link = page.locator(HOME.shopGiftBoxes).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/collections\/bundles/);
    await link.click();
    await expect(page).toHaveURL(/\/collections\/bundles/);
  });
});
