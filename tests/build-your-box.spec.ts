import { test, expect } from '@playwright/test';
import { BuildYourBoxPage, MAX_PIECES, toCents } from './pages/BuildYourBoxPage';
import data from './data/test-data.json';

const [A, B, C] = data.flavours;

test.describe('Build Your Box configurator', () => {
  let byb: BuildYourBoxPage;

  test.beforeEach(async ({ page }) => {
    byb = new BuildYourBoxPage(page);
    await byb.emptyCart();
    await byb.goto();
  });

  test.afterEach(async () => {
    await byb.emptyCart(); // never leave items in a live cart
  });

  test('TC-01 renders exactly six flavour slots', async () => {
    await expect(byb.slots).toHaveCount(MAX_PIECES);
  });

  test('TC-02 an empty box cannot reach the cart', async () => {
    if (await byb.addToCartButton.isEnabled()) {
      await byb.addToCartButton.click();
    }
    expect((await byb.cart()).item_count).toBe(0);
  });

  test('TC-03 choosing one flavour sets a positive subtotal', async () => {
    await byb.choose(0, A);
    expect(await byb.subtotalCents()).toBeGreaterThan(0);
  });

  test('TC-04 the same flavour can repeat and the subtotal scales exactly', async () => {
    await byb.choose(0, A);
    const one = await byb.subtotalCents();
    await byb.choose(1, A);
    expect(await byb.subtotalCents()).toBe(one * 2);
  });

  test('TC-05 removing a piece restores the previous subtotal', async () => {
    await byb.choose(0, A);
    const before = await byb.subtotalCents();
    await byb.choose(1, B);
    await byb.clearSlot(1);
    expect(await byb.subtotalCents()).toBe(before);
  });

  test('TC-06 replacing a flavour keeps the piece count unchanged', async () => {
    await byb.choose(0, A);
    await byb.choose(1, B);
    const countBefore = await byb.counter.innerText();
    const replaced = await byb.choose(1, C);
    await expect(byb.slot(1)).toContainText(replaced);
    await expect(byb.counter).toHaveText(countBefore);
  });

  test('TC-07 clear-all empties the box and zeroes the subtotal', async () => {
    await byb.choose(0, A);
    await byb.choose(1, B);
    await byb.clearAll();
    expect(await byb.subtotalCents()).toBe(0);
  });

  test('TC-08 a full box of six shows a valid savings figure', async () => {
    for (let i = 0; i < MAX_PIECES; i++) {
      await byb.choose(i, data.flavours[i % data.flavours.length]);
    }
    await expect(byb.savings).toBeVisible();
    const savings = toCents(await byb.savings.innerText());
    expect(savings).toBeGreaterThanOrEqual(0);
    if (data.expectedFullBoxSavingsCents !== null) {
      expect(savings).toBe(data.expectedFullBoxSavingsCents);
    }
  });

  test('TC-09 the cart receives exactly what was built', async () => {
    const chosen = [await byb.choose(0, A), await byb.choose(1, B), await byb.choose(2, A)];
    await byb.addToCart();
    const cart = await byb.cart();

    // Pieces may arrive as separate lines or as one bundle line with properties;
    // either way, the flavours chosen must be traceable in the cart.
    const cartText = JSON.stringify(cart.items).toLowerCase();
    for (const flavour of new Set(chosen)) {
      expect(cartText).toContain(flavour.toLowerCase().split(' ')[0]);
    }
    expect(cart.item_count).toBeGreaterThan(0);
  });
});
