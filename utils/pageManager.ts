import { Page } from "@playwright/test";
import { AbstractPage } from "../page-object/Abstract.page";
import { FTSE100Page } from "../page-object/FTSE100.page";

export class PageManager {
  private readonly page: Page;
  private readonly abstractPage: AbstractPage;
  private readonly ftse100Page: FTSE100Page;

  constructor(page: Page) {
    this.page = page;
    this.abstractPage = new AbstractPage(page);
    this.ftse100Page = new FTSE100Page(page);
  }

  get onPage() {
    return this.page;
  }

  get onAbstractPage() {
    return this.abstractPage;
  }

  get onFTSE100Page() {
    return this.ftse100Page;
  }
}
