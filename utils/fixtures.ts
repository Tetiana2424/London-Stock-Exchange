import { test as base } from "@playwright/test";
import { PageManager } from "./pageManager";
import { selectors } from "../test-data/selectors";

export type TestOptions = {
  customPage: PageManager;
  visitBasePage: string;
};

export const test = base.extend<TestOptions>({
  visitBasePage: [
    async ({ page }, use) => {
      await page.goto(process.env.FTSE_100_URL as string);
      await page.waitForSelector(selectors.table);
      await use("");
    },
    { auto: true },
  ],

  customPage: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },
});
