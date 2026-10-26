/**
 * Single source of truth for every locator the suite uses.
 * Mapped from the live theme (touchoffudge.com/pages/build-your-box, <tof-box> section).
 * The theme exposes stable data-* hooks, so the suite relies on those, not on styling classes.
 *
 * If the theme changes, re-check with:
 *   npx playwright codegen "https://touchoffudge.com/pages/build-your-box"
 */
export const BYB = {
  /** Each of the six flavour fields: <div class="tof-box__field" data-field="0..5"> */
  slot: '[data-selectors] [data-field]',
  /** Searchable combobox inside a field. */
  slotInput: 'input[data-slot]',
  /** Opens the full flavour list for a field. */
  slotToggle: 'button[data-toggle]',
  /** Visible options in that field's listbox (all 6 listboxes exist in the DOM, hidden ones are skipped). */
  option: '[role="option"]:visible',
  /** Per-field "×" clear button (hidden until the field has a flavour). */
  slotClear: 'button[data-clear]',
  /** "Clear all flavors" */
  clearAll: 'button[data-reset]',
  /** Review panel read-outs. */
  counter: '[data-selection-count]', // "3 pieces selected"
  progress: '[data-progress]', // offer progress message
  subtotal: '[data-subtotal]', // Selected pieces subtotal
  savings: '[data-savings]', // Estimated cart savings
  total: '[data-total]', // Estimated cart total
  /** Primary button: "Choose a flavor to begin" (disabled) → "Add N pieces to cart". */
  addToCart: 'button[data-add]',
} as const;

export const HOME = {
  /** Mobile-only entry point to gift boxes. */
  shopGiftBoxes: 'a:has-text("Shop Gift Boxes")',
} as const;
