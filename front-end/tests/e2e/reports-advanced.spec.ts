import { test, expect } from "@playwright/test";

const SHORT = 5000;
const MED = 10000;
const LONG = 20000;

test.describe("Advanced Reports Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
    // main heading (use first() if multiple)
    await expect(
      page.getByRole("heading", { name: /reports|דוחות/i }).first()
    ).toBeVisible({ timeout: LONG });
    // basic UI present
    await page.waitForSelector("select, input[type='date'], button", {
      timeout: MED,
    });
  });

  test("should display report generation controls", async ({ page }) => {
    await expect(
      page.getByText(/select.*employee|בחר.*עובד/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/select.*station|בחר.*תחנה/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/start.*date|תאריך.*התחלה/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/end.*date|תאריך.*סיום/i).first()
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /generate.*report|צור.*דוח/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /reset|אפס/i }).first()
    ).toBeVisible();
  });

  test("should populate employee dropdown", async ({ page }) => {
    const employeeSelect = page.locator("select").first();

    if (await employeeSelect.isVisible()) {
      // Ensure there is at least one option
      const optionCount = await employeeSelect.locator("option").count();
      expect(optionCount).toBeGreaterThanOrEqual(1);

      // Select a non-default option if available
      const options = await employeeSelect.locator("option").all();
      if (options.length > 1) {
        await employeeSelect.selectOption({ index: 1 });
        await expect(employeeSelect).not.toHaveValue("");
      }
    }
  });

  test("should populate station dropdown", async ({ page }) => {
    const stationSelect = page.locator("select").nth(1);

    if (await stationSelect.isVisible()) {
      const optionCount = await stationSelect.locator("option").count();
      expect(optionCount).toBeGreaterThanOrEqual(1);

      const options = await stationSelect.locator("option").all();
      if (options.length > 1) {
        await stationSelect.selectOption({ index: 1 });
        await expect(stationSelect).not.toHaveValue("");
      }
    }
  });

  test("should handle date range selection", async ({ page }) => {
    const datePickers = page.locator(
      'input[type="date"], input[placeholder*="dd/MM/yyyy"]'
    );

    if ((await datePickers.count()) >= 2) {
      const startDatePicker = datePickers.first();
      const endDatePicker = datePickers.nth(1);

      const startDate = "01/01/2024";
      const endDate = "31/01/2024";

      await startDatePicker.fill(startDate);
      await endDatePicker.fill(endDate);

      await expect(startDatePicker).toHaveValue(startDate, { timeout: SHORT });
      await expect(endDatePicker).toHaveValue(endDate, { timeout: SHORT });
    }
  });

  test("should generate report with all filters", async ({ page }) => {
    const employeeSelect = page.locator("select").first();
    const stationSelect = page.locator("select").nth(1);

    if (
      (await employeeSelect.isVisible()) &&
      (await stationSelect.isVisible())
    ) {
      const employeeOptions = await employeeSelect.locator("option").all();
      if (employeeOptions.length > 1)
        await employeeSelect.selectOption({ index: 1 });

      const stationOptions = await stationSelect.locator("option").all();
      if (stationOptions.length > 1)
        await stationSelect.selectOption({ index: 1 });
    }

    const datePickers = page.locator(
      'input[type="date"], input[placeholder*="dd/MM/yyyy"]'
    );
    if ((await datePickers.count()) >= 2) {
      await datePickers.first().fill("01/01/2024");
      await datePickers.nth(1).fill("31/01/2024");
    }

    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();

    // Wait for report to render (cards container)
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    // Spot checks for stats (use .first() to avoid strict-mode duplicates)
    await expect(
      page.getByText(/total.*production|סך.*ייצור/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/valid.*valves|שסתומים.*תקינים/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/defective.*valves|שסתומים.*פגומים/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/quality.*rate|אחוז.*איכות/i).first()
    ).toBeVisible();
  });

  test("should display advanced charts after report generation", async ({
    page,
  }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    await expect(
      page.getByText(/quality.*distribution|התפלגות.*איכות/i).first()
    ).toBeVisible({ timeout: MED });
    await expect(
      page.getByText(/production.*trend|מגמת.*ייצור/i).first()
    ).toBeVisible({ timeout: MED });
    await expect(
      page.getByText(/quality.*metrics|מדדי.*איכות/i).first()
    ).toBeVisible({ timeout: MED });
    await expect(
      page.getByText(/weekly.*performance|ביצועים.*שבועיים/i).first()
    ).toBeVisible({ timeout: MED });

    // Wait for canvases and assert count >= 4
    await page.waitForSelector("canvas", { timeout: LONG });
    const chartCanvases = page.locator("canvas");
    expect(await chartCanvases.count()).toBeGreaterThanOrEqual(4);
  });

  test("should enable PDF export after report generation", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    const exportButton = page
      .getByRole("button", { name: /export.*pdf|ייצוא.*pdf/i })
      .first();
    await expect(exportButton).toBeEnabled();
  });

  test("should export report to PDF", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    const exportButton = page
      .getByRole("button", { name: /export.*pdf|ייצוא.*pdf/i })
      .first();
    if (await exportButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        exportButton.click(),
      ]);
      const filename = await download.suggestedFilename();
      expect(filename).toMatch(/\.pdf$/i);
      expect(filename).toMatch(/production.*report/i);
    }
  });

  test("should reset all filters", async ({ page }) => {
    const employeeSelect = page.locator("select").first();
    const stationSelect = page.locator("select").nth(1);

    if (
      (await employeeSelect.isVisible()) &&
      (await stationSelect.isVisible())
    ) {
      // set some values if options exist
      const eOpts = await employeeSelect.locator("option").all();
      if (eOpts.length > 1) await employeeSelect.selectOption({ index: 1 });
      const sOpts = await stationSelect.locator("option").all();
      if (sOpts.length > 1) await stationSelect.selectOption({ index: 1 });
    }

    const datePickers = page.locator(
      'input[type="date"], input[placeholder*="dd/MM/yyyy"]'
    );
    if ((await datePickers.count()) >= 2) {
      await datePickers.first().fill("01/01/2024");
      await datePickers.nth(1).fill("31/01/2024");
    }

    const resetButton = page
      .getByRole("button", { name: /reset|אפס/i })
      .first();
    await resetButton.click();

    if (await employeeSelect.isVisible())
      await expect(employeeSelect).toHaveValue("");
    if (await stationSelect.isVisible())
      await expect(stationSelect).toHaveValue("");
  });

  test("should handle report generation loading state", async ({ page }) => {
    // slow the report API
    await page.route("**/api/report", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });

    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();

    // loading indicator should appear
    await expect(
      page.getByText(/generating|יוצר|loading|טוען/i).first()
    ).toBeVisible({ timeout: MED });
  });

  test("should display creative chart visualizations", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    await expect(
      page.getByText(/quality.*distribution|התפלגות.*איכות/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/production.*trend|מגמת.*ייצור/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/quality.*metrics|מדדי.*איכות/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/weekly.*performance|ביצועים.*שבועיים/i).first()
    ).toBeVisible();

    const chartContainers = page.locator(
      ".chart-container, .mobile-chart, .tablet-chart, .desktop-chart"
    );
    expect(await chartContainers.count()).toBeGreaterThanOrEqual(4);
  });

  test("should handle chart interactions", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    await page.waitForSelector("canvas", { timeout: MED });
    const chartCanvases = page.locator("canvas");
    if ((await chartCanvases.count()) > 0) {
      const firstChart = chartCanvases.first();
      await firstChart.hover();
      await page.waitForTimeout(500);
      await firstChart.click({ position: { x: 100, y: 100 } }).catch(() => {});
      await page.waitForTimeout(500);
    }
  });

  test("should show export loading state", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    // stub export endpoint to be slow
    await page.route("**/api/export-pdf", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });

    const exportButton = page
      .getByRole("button", { name: /export.*pdf|ייצוא.*pdf/i })
      .first();
    if (await exportButton.isVisible()) {
      await exportButton.click();
      await expect(
        page.getByText(/exporting|מייצא|loading|טוען/i).first()
      ).toBeVisible({ timeout: MED });
    }
  });

  test("should handle invalid date ranges", async ({ page }) => {
    const datePickers = page.locator(
      'input[type="date"], input[placeholder*="dd/MM/yyyy"]'
    );
    if ((await datePickers.count()) >= 2) {
      await datePickers.first().fill("31/01/2024");
      await datePickers.nth(1).fill("01/01/2024");

      const generateButton = page
        .getByRole("button", { name: /generate.*report|צור.*דוח/i })
        .first();
      await generateButton.click();

      await expect(
        page.getByText(/invalid.*date|תאריך.*לא.*תקין|error|שגיאה/i).first()
      ).toBeVisible({ timeout: MED });
    }
  });

  test("should show report generation timestamp", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    await expect(
      page.getByText(/generated|נוצר|report.*date|תאריך.*דוח/i).first()
    ).toBeVisible({ timeout: MED });
  });

  test("should handle responsive chart layout", async ({ page }) => {
    const generateButton = page
      .getByRole("button", { name: /generate.*report|צור.*דוח/i })
      .first();
    await generateButton.click();
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: LONG });

    // mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForSelector("canvas", { timeout: MED });
    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: SHORT,
    });

    // tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForSelector("canvas", { timeout: MED });
    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: SHORT,
    });

    // desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForSelector("canvas", { timeout: MED });
    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: SHORT,
    });
  });

  test("should show empty state when no report is generated", async ({
    page,
  }) => {
    // ensure we are on reports page with no report generated
    // check for empty state heading/text (use .first())
    await expect(
      page.getByText(/no.*data|אין.*נתונים|generate.*report|צור.*דוח/i).first()
    ).toBeVisible({ timeout: MED });

    const emptyStateIcon = page.locator(
      '.empty-state, .no-data-icon, [data-testid="empty-state"]'
    );
    if ((await emptyStateIcon.count()) > 0) {
      await expect(emptyStateIcon.first()).toBeVisible();
    }
  });
});
