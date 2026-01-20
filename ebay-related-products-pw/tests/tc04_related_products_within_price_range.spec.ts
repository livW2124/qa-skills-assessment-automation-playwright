import { test, expect } from '@playwright/test';
import { waitForRelatedSection, getMainPrice, getRelatedPrices, gotoPdp, PDP_URL } from "./helper";

test('tc04_related_products_within_price_range', async ({ page }) => {
  const pdpUrl = PDP_URL;
  const priceTolerance = Number(process.env.PRICE_TOLERANCE_RATIO || 0.2);

  const pdpReady = await gotoPdp(page, pdpUrl);
  if (!pdpReady) test.skip(true, 'Anti-bot challenge did not clear.');
  await expect(page).toHaveTitle(/.+/);

  const relatedSection = await waitForRelatedSection(page);
  const isVisible = await relatedSection.isVisible().catch(() => false);
  if (!isVisible) test.skip(true, 'Related section not visible for this PDP.');

  const mainPrice = await getMainPrice(page);
  if (!mainPrice) test.skip(true, 'Could not parse main price.');

  const min = mainPrice * (1 - priceTolerance);
  const max = mainPrice * (1 + priceTolerance);

  const relatedPrices = await getRelatedPrices(relatedSection);
  if (relatedPrices.length === 0) test.skip(true, 'No related prices detected.');

  const outOfRange = relatedPrices.filter(price => price < min || price > max);
  expect(outOfRange.length).toBe(0);
});
