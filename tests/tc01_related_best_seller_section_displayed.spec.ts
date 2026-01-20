import { test, expect } from '@playwright/test';
import { waitForRelatedSection, gotoPdp, PDP_URL } from "./helper";

test('tc01_related_best_seller_section_displayed', async ({ page }) => {
  const pdpUrl = PDP_URL;

  const pdpReady = await gotoPdp(page, pdpUrl);
  if (!pdpReady) test.skip(true, 'Anti-bot challenge did not clear.');
  await expect(page).toHaveTitle(/.+/);

  const relatedSection = await waitForRelatedSection(page);
  const isVisible = await relatedSection.isVisible().catch(() => false);
  expect(isVisible).toBeTruthy();
});
