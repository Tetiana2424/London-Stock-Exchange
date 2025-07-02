import { Locator, Page, Response } from "@playwright/test";
import { AbstractPage } from "./Abstract.page";
import { IFTSEConstituent } from "../Interface/IFTSE";
import { selectors } from "../test-data/selectors";

export class FTSE100Page extends AbstractPage {
  readonly rowsLocator: Locator;
  readonly searchBox: Locator;
  readonly searchContent: Locator;

  constructor(page: Page) {
    super(page);
    this.rowsLocator = this.page.locator(selectors.rows);
    this.searchBox = this.page.locator(selectors.searchBox);
    this.searchContent = this.page.locator(selectors.searchContent);
  }

  async sortByColumn(columnText: string, sortingBy: string): Promise<void> {
    const columnHeader = this.page.locator(`th:has-text("${columnText}")`);
    await columnHeader.click();
    await this.page
      .locator(`.dropmenu.expanded .sort-option`)
      .getByText(sortingBy, { exact: true })
      .waitFor();
    await this.page
      .locator(`.dropmenu.expanded .sort-option`)
      .getByText(sortingBy, { exact: true })
      .click();
    await this.page.waitForResponse(
      (response: Response) =>
        response.url().includes("/api/v1/components/refresh") &&
        response.status() === 200
    );
  }

  async getConstituents(): Promise<IFTSEConstituent[]> {
    const rows = await this.rowsLocator.all();
    const data = await Promise.all(
      rows.map(async (row) => {
        const name = await row.locator(selectors.name).textContent();
        const changeText = await row
          .locator(selectors.changeText)
          .textContent();
        const marketCapText = await row
          .locator(selectors.marketCapText)
          .textContent();
        const percentageChange = parseFloat(
          changeText?.replace("%", "") || "0"
        );
        let marketCap = 0;

        if (marketCapText) {
          const cleaned = marketCapText.replace(/,/g, "").trim();
          marketCap = parseFloat(cleaned);
        }
        return {
          name: name?.trim() || "",
          percentageChange,
          marketCap,
        };
      })
    );

    return data;
  }

  async getTopGainers(count = 10): Promise<IFTSEConstituent[]> {
    const data = await this.getConstituents();
    return data
      .sort((a, b) => b.percentageChange - a.percentageChange)
      .slice(0, count);
  }

  async getTopLosers(count = 10): Promise<IFTSEConstituent[]> {
    const data = await this.getConstituents();
    return data
      .sort((a, b) => a.percentageChange - b.percentageChange)
      .slice(0, count);
  }
}
