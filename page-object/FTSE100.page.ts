import { Locator, Page, Response } from "@playwright/test";
import { AbstractPage } from "./Abstract.page";
import { IFTSEConstituent } from "../Interface/IFTSE";
import { selectors } from "../test-data/selectors";
import { getCurrentDayNumber } from "../utils/helpers";

export class FTSE100Page extends AbstractPage {
  readonly rowsLocator: Locator;
  readonly searchBox: Locator;
  readonly searchContent: Locator;
  readonly selectFromDate: Locator;
  readonly previousYear: Locator;
  readonly randomDate: Locator;

  constructor(page: Page) {
    super(page);
    this.rowsLocator = this.page.locator(selectors.rows);
    this.searchBox = this.page.locator(selectors.searchBox);
    this.searchContent = this.page.locator(selectors.searchContent);
    this.selectFromDate = this.page.locator(selectors.selectFromDate);
    this.previousYear = this.page.locator(selectors.previousYear);
    this.randomDate = this.page
      .locator(selectors.dateButton)
      .getByText(getCurrentDayNumber().toString(), { exact: true })
      .first();
  }

  public async sortByColumn(
    columnText: string,
    sortingBy: string
  ): Promise<void> {
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

  public async getConstituents(): Promise<IFTSEConstituent[]> {
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

  public async getTopGainers(count = 10): Promise<IFTSEConstituent[]> {
    const data = await this.getConstituents();
    return data
      .sort((a, b) => b.percentageChange - a.percentageChange)
      .slice(0, count);
  }

  public async getTopLosers(count = 10): Promise<IFTSEConstituent[]> {
    const data = await this.getConstituents();
    return data
      .sort((a, b) => a.percentageChange - b.percentageChange)
      .slice(0, count);
  }

  public async setNumberOfRecorderYears(
    yearsNumber: number
  ): Promise<Response> {
    await this.selectFromDate.click();

    for (let year = 1; year <= yearsNumber; year++) {
      await this.previousYear.click();
    }

    await this.randomDate.click();
    return await this.page.waitForResponse(
      (resp) =>
        resp.url().includes("api/timeseries/historical?") &&
        resp.status() === 200
    );
  }

  public async getLowestScore(
    response: Response
  ): Promise<{ month: string; avg: number }> {
    const responseBody = await response.json();
    const monthlyData: Record<string, number[]> = {};

    for (const entry of responseBody.data) {
      const date = entry._DATE_END;
      const close = parseFloat(entry.CLOSE_PRC);
      const [year, month] = date.split("-");
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = [];
      }

      if (!isNaN(close)) {
        monthlyData[key].push(close);
      }
    }

    const averages: { month: string; avg: number }[] = Object.entries(
      monthlyData
    ).map(([month, values]) => ({
      month,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }));

    return averages.reduce((min, curr) => (curr.avg < min.avg ? curr : min));
  }
}
