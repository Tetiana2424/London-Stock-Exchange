import { Locator, Page } from "@playwright/test";
import { selectors } from "../test-data/selectors";

export class AbstractPage {
  readonly page: Page;
  readonly cookieBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieBtn = this.page.locator(selectors.cookieBtn);
  }

  async acceptCookiesIfVisible(): Promise<void> {
    await this.cookieBtn.waitFor();
    await this.cookieBtn.click();
  }
}
