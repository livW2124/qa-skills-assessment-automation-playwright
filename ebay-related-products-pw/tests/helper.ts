import { Page, Locator } from '@playwright/test';

declare const window: any;
declare const document: any;

export const PDP_URL = process.env.PDP_URL || 'https://www.ebay.com/itm/203951606662';

export async function waitForRelatedSection(page: Page): Promise<Locator> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(3000); // Wait for dynamic content

  // Scroll to find content below fold
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);

  const relatedSection = page.locator(
    'section:has-text("Similar Items - Sponsored"), div:has-text("Similar Items - Sponsored"), ' +
      'section:has-text("Similar Items"), div:has-text("Similar Items"), ' +
      'section:has-text("Similar"), div:has-text("Similar"), ' +
      'section:has-text("Related"), div:has-text("Related"), ' +
      '[class*="similar"], [class*="related"]'
  ).first();

  try {
    await relatedSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  } catch (e) {
    // Continue anyway
  }

  return relatedSection;
}

export async function getVisibleRelatedLinks(relatedSection: Locator): Promise<string[]> {
  const hrefs = await relatedSection.locator('a[href*="/itm/"]').evaluateAll((els) => {
    const visibleLinks = els.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return visibleLinks
      .map(e => (e as any).href)
      .filter(Boolean);
  });
  return Array.from(new Set(hrefs));
}

export async function getRelatedTitles(relatedSection: Locator): Promise<string[]> {
  const titles = await relatedSection.locator('a[href*="/itm/"]').evaluateAll((els) => {
    return els
      .map(el => {
        const anchor = el as any;
        return (
          anchor.getAttribute('title') ||
          anchor.getAttribute('aria-label') ||
          anchor.textContent ||
          ''
        ).trim();
      })
      .filter(Boolean);
  });
  return Array.from(new Set(titles));
}

export async function getMainPrice(page: Page): Promise<number | null> {
  const mainPriceEl = page.locator('#prcIsum, [data-testid="x-price-primary"], .x-price-primary').first();
  const mainPriceText = await mainPriceEl.innerText().catch(() => '');
  const mainPriceMatch = mainPriceText.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  return mainPriceMatch ? Number(mainPriceMatch[1]) : null;
}

export async function getRelatedPrices(relatedSection: Locator): Promise<number[]> {
  const priceTexts = await relatedSection.locator('span, div').evaluateAll((els) =>
    els.map(e => (e as any).innerText).filter(Boolean)
  );

  const relatedPrices = priceTexts
    .filter(text => /\$|US\s*\$/i.test(text))
    .map(text => {
      const match = text.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
      return match ? Number(match[1]) : null;
    })
    .filter((v): v is number => v !== null);

  return relatedPrices;
}

export async function gotoPdp(page: Page, url: string): Promise<boolean> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const challengeLocator = page.locator('text=/checking your browser|verify you are human|accessing/i').first();
  const title = await page.title().catch(() => '');
  const titleLooksBlocked = /just a moment|attention required|verify/i.test(title);
  const challengeVisible = await challengeLocator.isVisible().catch(() => false);

  if (challengeVisible || titleLooksBlocked) {
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await challengeLocator.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});

    const stillVisible = await challengeLocator.isVisible().catch(() => false);
    const finalTitle = await page.title().catch(() => '');
    const stillBlocked = /just a moment|attention required|verify/i.test(finalTitle);

    if (stillVisible || stillBlocked) {
      return false;
    }
  }

  return true;
}
