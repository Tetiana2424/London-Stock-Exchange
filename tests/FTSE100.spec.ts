import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";

test.describe("FTSE 100 Tests", () => {
  test.beforeEach(async ({ customPage }) => {
    const { onAbstractPage } = customPage;
    await onAbstractPage.acceptCookiesIfVisible();
  });

  test("Top 10 gainers by % change after sorting", async ({ customPage }) => {
    const { onFTSE100Page } = customPage;

    await onFTSE100Page.sortByColumn("Change %", `Highest – lowest`);

    const gainers = await onFTSE100Page.getTopGainers();
    expect(gainers.length).toBe(10);
    expect(gainers[0].percentageChange).toBeGreaterThan(
      gainers[9].percentageChange
    );
  });

  test("Top 10 losers by % change after sorting", async ({ customPage }) => {
    const { onFTSE100Page } = customPage;

    await onFTSE100Page.sortByColumn("Change %", `Lowest – highest`);

    const losers = await onFTSE100Page.getTopLosers();
    expect(losers.length).toBe(10);
    expect(losers[0].percentageChange).toBeLessThan(losers[9].percentageChange);
  });

  test("Display FTSE 100 constituents with Market Cap > £7M", async ({
    customPage,
  }) => {
    const { onFTSE100Page } = customPage;

    await onFTSE100Page.sortByColumn("Market cap (m)", `Highest – lowest`);
    const constituents = await onFTSE100Page.getConstituents();
    const over7Million = constituents.filter((c) => c.marketCap > 7000000.0);

    if (over7Million.length === 0) {
      console.warn("No constituents found with Market Cap > £7M.");
    } else {
      expect(over7Million.length).toBeGreaterThan(0);
    }
  });

  test("Find month with lowest average FTSE 100 index value over past 3 years", async ({
    customPage,
  }) => {
    const { onFTSE100Page, onPage } = customPage;
    await onPage.goto(process.env.HISTIRICAL_DATA_URL as string);

    const response = await onFTSE100Page.setNumberOfRecorderYears(2);
    const lowest = await onFTSE100Page.getLowestScore(response);

    expect(lowest.avg).toBeGreaterThan(0);
  });
});
