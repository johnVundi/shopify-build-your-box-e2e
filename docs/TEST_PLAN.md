# Test Plan: Build Your Box Configurator

## 1. Objective
Confirm that a shopper can build a gift box of one to six fudge pieces, see an accurate price, and receive exactly that box in the Shopify cart, on desktop and mobile.

## 2. Scope

| In scope | Out of scope |
|---|---|
| Slot rendering and the six-piece limit | Checkout and payment |
| Flavour search and selection | Shipping rates and taxes |
| Repeats, single-slot removal, replace, clear-all | Inventory sync with the supplier |
| Subtotal and savings calculation | Marketing pixels and analytics accuracy |
| Cart handoff (contents and quantities) | Load and performance testing |
| Mobile "Shop Gift Boxes" entry point | |
| Critical URLs returning 200 (SEO guard) | |

## 3. Approach
- **Automated E2E:** Playwright + TypeScript, page-object pattern, run on Desktop Chrome, Pixel 7 and iPhone 14 profiles.
- **Cart verification:** asserts against Shopify's AJAX cart API (`/cart.js`), not just the UI, so a correct-looking page with a wrong cart still fails.
- **Unit checks:** the price parser that the E2E assertions depend on is tested on its own.
- **Exploratory sessions:** 30-minute time-boxed charters (see section 7), with findings logged as bug reports in `docs/bugs/`.

## 4. Environments
- Preferred: an unpublished Shopify preview theme (`PREVIEW_THEME_ID`), so test traffic never reaches the live theme.
- Live store: read-only checks are safe; cart tests add and then clear items, and never check out.

## 5. Entry and exit criteria
- **Entry:** the page loads, locators are confirmed with `npx playwright codegen`, and test data matches the live catalogue.
- **Exit:** all P1 cases pass on all three device profiles, and no open Critical or High bugs remain.

## 6. Risks

| Risk | Mitigation |
|---|---|
| Promotion rules conflict across historical notes | Savings value is configurable (`expectedFullBoxSavingsCents`); confirm the current rule with the store owner before asserting an exact figure |
| Theme updates change markup | All locators live in one file (`tests/pages/selectors.ts`) |
| Test traffic skews store analytics | Run against a preview theme; keep cart tests few and always clean up |

## 7. Exploratory charters
1. Rapidly add and remove pieces on a slow 3G profile. Does the subtotal ever lag behind or desynchronise?
2. Search with misspellings, partial words and emoji. Do results stay sensible?
3. Build a box, open the cart in a second tab, edit it there, and return. Which state wins?
4. Use keyboard only, then a screen reader. Can the box be completed?
