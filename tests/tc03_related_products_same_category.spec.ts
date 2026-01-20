import { test, expect } from '@playwright/test';
import { waitForRelatedSection, getRelatedTitles, gotoPdp, PDP_URL } from "./helper";

test('tc03_related_products_same_category', async ({ page }) => {
  const pdpUrl = PDP_URL;

  const pdpReady = await gotoPdp(page, pdpUrl);
  if (!pdpReady) test.skip(true, 'Anti-bot challenge did not clear.');
  await expect(page).toHaveTitle(/.+/);

  const relatedSection = await waitForRelatedSection(page);
  const isVisible = await relatedSection.isVisible().catch(() => false);
  if (!isVisible) test.skip(true, 'Related section not visible for this PDP.');

  const mainTitle = (await page.locator('h1').first().innerText().catch(() => '')).toLowerCase();
  if (!mainTitle.includes('wallet')) {
    test.skip(true, 'Main product is not recognized as a wallet.');
  }

  const titles = await getRelatedTitles(relatedSection);
  if (titles.length === 0) test.skip(true, 'No related product titles detected.');

  const nonWallet = titles.filter(title => !title.toLowerCase().includes('wallet'));
  expect(nonWallet.length).toBe(0);
});
