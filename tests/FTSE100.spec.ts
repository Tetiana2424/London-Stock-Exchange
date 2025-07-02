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
});
