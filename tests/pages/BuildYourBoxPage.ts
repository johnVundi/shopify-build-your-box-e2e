import { expect, type Locator, type Page } from '@playwright/test';
import { BYB } from './selectors';

export const MAX_PIECES = 6;

const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Match option labels that begin with the query, so "Amaretto" never picks "Dark Chocolate Amaretto". */
const startsWith = (q: string) => new RegExp(`^\\s*${escapeRe(q)}`, 'i');

/** Shopify AJAX cart shape (subset we assert on). */
export interface ShopifyCart {
  item_count: number;
  total_price: number; // in cents
  items: Array<{ variant_id: number; quantity: number; title: string; properties?: Record<string, string> | null }>;
}

/** Parse "$12.50", "12,50 $" etc. into a number of cents. */
export function toCents(text: string): number {
  const cleaned = text.replace(/[^\d.,]/g, '').replace(/,(?=\d{3}\b)/g, '').replace(',', '.');
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) throw new Error(`Could not parse a price from "${text}"`);
  return Math.round(value * 100);
}

export class BuildYourBoxPage {
  readonly slots: Locator;
  readonly subtotal: Locator;
  readonly savings: Locator;
  readonly counter: Locator;
  readonly progress: Locator;
  readonly total: Locator;
  readonly addToCartButton: Locator;
  readonly clearAllButton: Locator;

  constructor(private readonly page: Page) {
    this.slots = page.locator(BYB.slot);
    this.subtotal = page.locator(BYB.subtotal);
    this.savings = page.locator(BYB.savings);
    this.counter = page.locator(BYB.counter);
    this.progress = page.locator(BYB.progress);
    this.total = page.locator(BYB.total);
    this.addToCartButton = page.locator(BYB.addToCart).first();
    this.clearAllButton = page.locator(BYB.clearAll).first();
  }

  /** Open the page, optionally on an unpublished preview theme. */
  async goto(): Promise<void> {
    const path = process.env.BYB_PATH || '/pages/build-your-box';
    const theme = process.env.PREVIEW_THEME_ID;
    await this.page.goto(theme ? `${path}?preview_theme_id=${theme}` : path);
    await expect(this.slots.first()).toBeVisible();
  }

  slot(index: number): Locator {
    return this.slots.nth(index);
  }

  /**
   * Type into a field's search box and pick the first matching visible option.
   * Returns the flavour label without the price, e.g. "Amaretto – ½ lb".
   */
  async choose(index: number, query: string): Promise<string> {
    const slot = this.slot(index);
    const input = slot.locator(BYB.slotInput);
    await input.click();
    await input.fill(query);
    const option = slot.locator(BYB.option).filter({ hasText: startsWith(query) }).first();
    await expect(option).toBeVisible();
    const label = (await option.innerText()).split('·')[0].trim();
    await option.click();
    await expect(input).toHaveValue(label);
    return label;
  }

  async clearSlot(index: number): Promise<void> {
    await this.slot(index).locator(BYB.slotClear).first().click();
  }

  async clearAll(): Promise<void> {
    await this.clearAllButton.click();
  }

  async subtotalCents(): Promise<number> {
    return toCents(await this.subtotal.innerText());
  }

  async savingsCents(): Promise<number> {
    return toCents(await this.savings.innerText());
  }

  async totalCents(): Promise<number> {
    return toCents(await this.total.innerText());
  }

  async addToCart(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((r) => /\/cart\/add(\.js)?/.test(r.url()) && r.request().method() === 'POST'),
      this.addToCartButton.click(),
    ]);
  }

  /** Read the cart through Shopify's AJAX API, using this browser context's cookies. */
  async cart(): Promise<ShopifyCart> {
    const res = await this.page.request.get('/cart.js');
    expect(res.ok()).toBeTruthy();
    return (await res.json()) as ShopifyCart;
  }

  /** Empty the cart so tests stay independent and nothing lingers on the store. */
  async emptyCart(): Promise<void> {
    await this.page.request.post('/cart/clear.js');
  }
}
