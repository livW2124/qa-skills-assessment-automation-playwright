import { test, expect } from '@playwright/test';
import { waitForRelatedSection, getVisibleRelatedLinks, gotoPdp, PDP_URL } from "./helper";

test('tc02_max_six_related_products_displayed', async ({ page }) => {
  const pdpUrl = PDP_URL;

  const pdpReady = await gotoPdp(page, pdpUrl);
  if (!pdpReady) test.skip(true, 'Anti-bot challenge did not clear.');
  await expect(page).toHaveTitle(/.+/);

  const relatedSection = await waitForRelatedSection(page);
  const isVisible = await relatedSection.isVisible().catch(() => false);
  if (!isVisible) test.skip(true, 'Related section not visible for this PDP.');

  const links = await getVisibleRelatedLinks(relatedSection);
  if (links.length === 0) {
    test.skip(true, 'No related products detected.');
  }

  expect(links.length).toBeLessThanOrEqual(6);
});
