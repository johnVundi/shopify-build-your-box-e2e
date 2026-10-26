import { test, expect } from '@playwright/test';
import data from './data/test-data.json';

test.describe('Critical URLs (SEO and broken-link guard)', () => {
  test.skip(({ isMobile }) => isMobile, 'Status checks only need one project');

  for (const path of data.criticalUrls) {
    test(`TC-13 ${path} responds 200`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), `${path} returned ${res.status()}`).toBe(200);
    });
  }
});
