# FTSE 100 Testing Framework

This repository contains an automated testing framework built with [Playwright](https://playwright.dev/) to validate key data and functionalities on the FTSE 100 constituents page of the London Stock Exchange website.

---

## Framework Overview

The framework uses **Playwright** with **TypeScript** and follows the **Page Object Model (POM)** design pattern to improve maintainability and scalability. Key components include:

### 1. Page Objects

- **AbstractPage**: Base page object encapsulating common functionality, such as cookie acceptance.
- **FTSE100Page**: Specific page object for the FTSE 100 page, responsible for interacting with the table of constituents. It includes methods for:
  - Sorting columns by specified criteria.
  - Retrieving the list of FTSE 100 constituents.
  - Filtering top gainers and losers based on percentage change.

### 2. Interface

- **IFTSEConstituent**: Defines the shape of the constituent data including company name, percentage change, and market capitalization.

### 3. Utilities

- **PageManager**: Manages page objects and exposes them through convenient getters.
- **Fixtures**: Extends Playwright test fixtures to include custom page management and automatic navigation to the base FTSE 100 URL.
- **Selectors**: Centralized CSS selectors used across page objects.

### 4. Tests

Tests are organized under the `tests` directory and utilize the page objects and fixtures. Example tests include:

- Validating the top 10 gainers and losers sorted by percentage change.
- Accepting cookies before tests.
- Using sorting dropdowns with explicit sorting options.

# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Tetiana2424/London-Stock-Exchange.git
cd London-Stock-Exchange
```

2. Install dependencies:
run `npm install`

3. Create a .env file in the root directory with the following environment variable:
`FTSE_100_URL=https://www.londonstockexchange.com/indices/ftse-100/constituents/table`

## Running Tests

`npm test` or `npx playwright test`

## Playwright Test Options

Run tests in headed mode (visible browser): `npx playwright test --headed`

Run tests in a specific browser (e.g., Chromium): `npx playwright test --project=chromium`

Generate an HTML report: `npx playwright show-report`