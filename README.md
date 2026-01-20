# eBay Related Products - Playwright Test Suite

## Project Overview

This project automates testing of eBay's "Similar Items - Sponsored" section on Product Detail Pages (PDPs). The test suite validates that related product recommendations are displayed correctly and meet specified criteria.

### Test Cases

The test suite includes five test cases:

1. **TC-01**: Verify related best seller section is displayed
2. **TC-02**: Verify maximum of six related products displayed
3. **TC-03**: Verify related products belong to same category
4. **TC-04**: Verify related products are within price range
5. **TC-05**: Verify behavior when fewer than six related products exist

## Setup Steps

### Prerequisites

- Node.js (v16 or higher recommended)
- npm package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

3. **Configure test URL**:
   - Set the `PDP_URL` environment variable (see Environment Variables section), OR
   - Update the default URL in `tests/helper.ts`

## How to Run Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### View test report
```bash
npm run report
```

## Environment Variables

### `PDP_URL`
- **Description**: The eBay Product Detail Page URL to test against
- **Default**: `https://www.ebay.com/itm/203951606662`
- **Usage**:
  ```bash
  PDP_URL="https://www.ebay.com/itm/123456789" npm test
  ```

### `PRICE_TOLERANCE_RATIO`
- **Description**: The price tolerance ratio for validating related product prices (e.g., 0.2 = ±20%)
- **Default**: `0.2` (20% tolerance)
- **Usage**:
  ```bash
  PRICE_TOLERANCE_RATIO=0.15 npm test
  ```
- **Example**: If main product is $100 and ratio is 0.2, related products should be between $80-$120

## Framework Structure

```
ebay-related-products-pw/
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies and scripts
├── README.md                # Documentation
└── tests/                   # Test specifications and helpers
    ├── helper.ts            # Shared utilities and constants
    ├── tc01_related_best_seller_section_displayed.spec.ts
    ├── tc02_max_six_related_products_displayed.spec.ts
    ├── tc03_related_products_same_category.spec.ts
    ├── tc04_related_products_within_price_range.spec.ts
    └── tc05_fewer_than_six_related_products.spec.ts
```

### Directory Breakdown

- **`tests/`**: Contains test specifications and shared helper functions
  - **`helper.ts`**: Shared utilities for navigation, locators, price parsing, and test data configuration

## Test Assumptions

### Price Range Definition
- "Same price range" is defined as products within ±20% of the main product price (configurable via `PRICE_TOLERANCE_RATIO`)

### Maximum Related Items
- The related products section displays a maximum of 6 items
- If fewer than 6 items are available, displaying fewer is acceptable
- Tests verify `count > 0 && count <= 6`

### Behavior When No Related Products Exist
- If no related products section is visible, tests skip gracefully using `test.skip()`

### Price Parsing
- Prices may appear in various formats (`$12.34`, `US $12.34`, `$12`, `12.34`)
- Price extraction handles multiple formats and extracts numeric values

## eBay Anti-Bot Challenge Handling

eBay may display a "Checking your browser" challenge page before loading the product page. The test suite includes handling for this:

- Tests wait for the challenge to clear automatically
- If the challenge does not clear within the timeout period, tests skip gracefully

## Troubleshooting

### Tests fail with "Related section not visible"
- Verify the product URL has related products available
- Check if the page structure has changed (inspect the page)
- Update locators in `tests/helper.ts` if needed

### Price parsing fails
- Inspect the actual price element structure on the page
- Update price extraction logic in `tests/helper.ts` if price format differs
- Check if price is loaded dynamically and add appropriate waits

### Anti-bot challenge does not clear
- eBay may be blocking automated access
- Try running tests with `--headed` flag to see browser behavior
- Consider using a different product URL or waiting longer between test runs
