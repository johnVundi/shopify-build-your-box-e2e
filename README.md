# Shopify "Build Your Box" — E2E Test Suite

End-to-end and unit tests for a Shopify gift-box configurator, written in **Playwright + TypeScript**.

The configurator lets shoppers build a box of one to six fudge pieces from six searchable flavour slots, with repeats, removal, replacement, a live subtotal and savings, and handoff to the Shopify cart. I built the feature; this repo is how I prove it works.

## What's covered

| Area | Cases | How |
|---|---|---|
| Configurator rules and pricing | TC-01 – TC-10 | UI assertions via a page object, incl. the buy-6-pay-for-5 offer |
| Cart handoff | TC-11 | Verified against Shopify's `/cart.js` API, not just the UI |
| Mobile entry point | TC-12 | Pixel 7 and iPhone 14 device profiles |
| SEO / broken links | TC-13 | HTTP status checks on critical URLs |
| Price parsing | TC-U | Pure unit tests, no browser needed |

Full details: [Test Plan](docs/TEST_PLAN.md) · [Test Cases](docs/TEST_CASES.md) · [Bug template](docs/BUG_REPORT_TEMPLATE.md)

## Design decisions
- **Page Object Model** (`tests/pages/BuildYourBoxPage.ts`) keeps test intent readable and locators in one place.
- **Cart truth over UI truth.** A page can look right while the cart is wrong, so the handoff test reads the real cart.
- **Clean-up after every test.** The cart is emptied before and after each case, and nothing ever reaches checkout.
- **Preview-theme support.** Set `PREVIEW_THEME_ID` to test an unpublished theme instead of the live one.
- **Three device profiles.** Desktop Chrome, Pixel 7 and iPhone 14 (WebKit).

## Run it

```bash
npm install
npx playwright install
cp .env.example .env        # set BASE_URL and BYB_PATH
npm run typecheck
npm test                    # all projects
npm run test:mobile         # mobile only
npm run report              # open the HTML report
```

### Locators
The theme exposes stable `data-*` hooks (`data-field`, `data-slot`, `data-subtotal`, `data-add`…), and all of them are mapped in `tests/pages/selectors.ts`. If the theme changes, re-check with `npm run codegen -- "https://touchoffudge.com/pages/build-your-box"`.

## Project structure

```
tests/
  pages/            page object + all selectors
  data/             flavours, critical URLs, expected savings
  *.spec.ts         E2E and unit specs
docs/               test plan, test cases, bug reports
.github/workflows/  CI (manual + pull requests)
```
