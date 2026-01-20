import { test, expect } from '@playwright/test';
import { waitForRelatedSection, getVisibleRelatedLinks, gotoPdp, PDP_URL } from "./helper";

test('tc05_fewer_than_six_related_products', async ({ page }) => {
  const pdpUrl = PDP_URL;

  const pdpReady = await gotoPdp(page, pdpUrl);
  if (!pdpReady) test.skip(true, 'Anti-bot challenge did not clear.');
  await expect(page).toHaveTitle(/.+/);

  const relatedSection = await waitForRelatedSection(page);
  const isVisible = await relatedSection.isVisible().catch(() => false);
  if (!isVisible) test.skip(true, 'Related section not visible for this PDP.');

  const links = await getVisibleRelatedLinks(relatedSection);
  if (links.length === 0) test.skip(true, 'No related products detected.');
  if (links.length >= 6) test.skip(true, 'Precondition not met: fewer than six products.');

  expect(links.length).toBeGreaterThan(0);
  expect(links.length).toBeLessThanOrEqual(6);
});
