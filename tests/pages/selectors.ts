/**
 * Single source of truth for every locator the suite uses.
 *
 * Before the first run, confirm each entry against the live theme:
 *   npx playwright codegen "$BASE_URL$BYB_PATH"
 * Prefer data-testid attributes if you can add them to the theme;
 * otherwise use accessible roles and names (what a user actually sees).
 */
export const BYB = {
  /** Each of the six flavour slots (searchable select / combobox). */
  slot: '[data-byb-slot], .byb-slot',
  /** Search/select input inside a slot. */
  slotInput: 'input[type="search"], input[role="combobox"], select',
  /** Option entries shown after typing in a slot. */
  option: '[role="option"], .byb-option',
  /** Per-slot remove / clear control. */
  slotClear: 'button[aria-label*="remove" i], button[aria-label*="clear" i], .byb-slot__clear',
  /** Clear-all control for the whole box. */
  clearAll: 'button:has-text("Clear"), .byb-clear-all',
  /** Running subtotal and savings read-outs. */
  subtotal: '[data-byb-subtotal], .byb-subtotal',
  savings: '[data-byb-savings], .byb-savings',
  /** Piece counter, e.g. "3 / 6". */
  counter: '[data-byb-count], .byb-count',
  /** Primary add-to-cart button. */
  addToCart: 'button:has-text("Add to cart"), button:has-text("Add box to cart")',
} as const;

export const HOME = {
  /** Mobile-only entry point to gift boxes. */
  shopGiftBoxes: 'a:has-text("Shop Gift Boxes")',
} as const;
