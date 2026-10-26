import { test, expect } from '@playwright/test';
import { BuildYourBoxPage, MAX_PIECES } from './pages/BuildYourBoxPage';
import data from './data/test-data.json';

const [A, B, C] = data.flavours;
const UNIT = data.unitPriceCents;

test.describe('Build Your Box configurator', () => {
  let byb: BuildYourBoxPage;

  test.beforeEach(async ({ page }) => {
    byb = new BuildYourBoxPage(page);
    await byb.emptyCart(); // estimates include the existing cart, so start from zero
    await byb.goto();
  });

  test.afterEach(async () => {
    await byb.emptyCart(); // never leave items in a live cart
  });

  test('TC-01 renders exactly six flavour fields', async () => {
    await expect(byb.slots).toHaveCount(MAX_PIECES);
    await expect(byb.counter).toHaveText('0 pieces selected');
  });

  test('TC-02 an empty box cannot be added to the cart', async () => {
    await expect(byb.addToCartButton).toBeDisabled();
    await expect(byb.addToCartButton).toHaveText(/choose a flavor to begin/i);
    await expect(byb.clearAllButton).toBeDisabled();
    expect((await byb.cart()).item_count).toBe(0);
  });

  test('TC-03 one flavour prices one piece and enables the button', async () => {
    await byb.choose(0, A);
    await expect(byb.counter).toHaveText('1 piece selected');
    expect(await byb.subtotalCents()).toBe(UNIT);
    await expect(byb.addToCartButton).toBeEnabled();
    await expect(byb.addToCartButton).toHaveText(/add 1 piece to cart/i);
  });

  test('TC-04 the same flavour can repeat and the subtotal scales exactly', async () => {
    await byb.choose(0, A);
    const one = await byb.subtotalCents();
    await byb.choose(1, A);
    await expect(byb.counter).toHaveText('2 pieces selected');
    expect(await byb.subtotalCents()).toBe(one * 2);
  });

  test('TC-05 clearing one field restores the previous subtotal', async () => {
    await byb.choose(0, A);
    const before = await byb.subtotalCents();
    await byb.choose(1, B);
    await byb.clearSlot(1);
    await expect(byb.counter).toHaveText('1 piece selected');
    expect(await byb.subtotalCents()).toBe(before);
  });

  test('TC-06 replacing a flavour keeps the piece count unchanged', async () => {
    await byb.choose(0, A);
    await byb.choose(1, B);
    await byb.choose(1, C);
    await expect(byb.slot(1).locator('input')).toHaveValue(new RegExp(`^${C}`, 'i'));
    await expect(byb.counter).toHaveText('2 pieces selected');
  });

  test('TC-07 clear-all empties every field and zeroes the totals', async () => {
    await byb.choose(0, A);
    await byb.choose(1, B);
    await byb.clearAll();
    await expect(byb.counter).toHaveText('0 pieces selected');
    expect(await byb.subtotalCents()).toBe(0);
    await expect(byb.addToCartButton).toBeDisabled();
  });

  test('TC-08 six pieces qualify for the offer: cheapest piece is free', async () => {
    for (let i = 0; i < MAX_PIECES; i++) {
      await byb.choose(i, data.flavours[i % data.flavours.length]);
    }
    await expect(byb.counter).toHaveText('6 pieces selected');
    expect(await byb.subtotalCents()).toBe(UNIT * MAX_PIECES);
    expect(await byb.savingsCents()).toBe(data.expectedFullBoxSavingsCents);
    expect(await byb.totalCents()).toBe(UNIT * (MAX_PIECES - 1));
    await expect(byb.progress).toContainText(/qualify for the offer/i);
  });

  test('TC-09 estimated total always equals subtotal minus savings', async () => {
    for (const pieces of [1, 5, 6]) {
      await byb.goto(); // fresh, empty box for each size
      for (let i = 0; i < pieces; i++) await byb.choose(i, data.flavours[i]);
      const [sub, sav, total] = [await byb.subtotalCents(), await byb.savingsCents(), await byb.totalCents()];
      expect(total, `${pieces} pieces`).toBe(sub - sav);
    }
  });

  test('TC-10 five pieces do not qualify for the offer', async () => {
    for (let i = 0; i < 5; i++) await byb.choose(i, data.flavours[i]);
    expect(await byb.savingsCents()).toBe(0);
    await expect(byb.progress).toContainText(/sixth piece/i);
  });

  test('TC-11 the cart receives exactly what was built', async () => {
    const chosen = [await byb.choose(0, A), await byb.choose(1, B), await byb.choose(2, A)];
    await byb.addToCart();
    const cart = await byb.cart();
    expect(cart.item_count).toBe(chosen.length);

    const cartText = JSON.stringify(cart.items).toLowerCase();
    for (const flavour of new Set([A, B])) {
      expect(cartText, `${flavour} missing from cart`).toContain(flavour.toLowerCase());
    }
  });
});
