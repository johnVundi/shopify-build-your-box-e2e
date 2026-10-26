import { test, expect } from '@playwright/test';
import { toCents } from './pages/BuildYourBoxPage';

// Pure unit checks on the price parser the E2E assertions depend on.
// No browser or network needed, so these run anywhere.
test.describe('toCents price parser', () => {
  test.skip(({ isMobile }) => isMobile, 'Unit tests run once');

  const cases: Array<[string, number]> = [
    ['$12.50', 1250],
    ['$0.00', 0],
    ['Subtotal: $1,234.99', 123499],
    ['12,50 €', 1250],
    ['$7', 700],
  ];

  for (const [input, expected] of cases) {
    test(`TC-U parses "${input}" as ${expected}`, () => {
      expect(toCents(input)).toBe(expected);
    });
  }

  test('TC-U rejects text with no number', () => {
    expect(() => toCents('Free')).toThrow();
  });
});
