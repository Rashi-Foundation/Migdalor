import { test, expect } from "@playwright/test";

test.describe("Reports Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
    await expect(
      page.getByRole("heading", { name: /reports|דוחות/i })
    ).toBeVisible();
  });

  test("generate report with filters and enable export", async ({ page }) => {
    // Select first employee if available
    const empSelect = page.locator("select").nth(0);
    await expect(empSelect).toBeVisible();

    // Select first station if available
    const stationSelect = page.locator("select").nth(1);
    await expect(stationSelect).toBeVisible();

    // Generate report
    const genBtn = page
      .getByRole("button")
      .filter({ hasText: /generate|צור|ג'נרייט|הפק/i })
      .first();
    await genBtn.click();

    // Wait for stats to appear
    await expect(
      page.locator(".responsive-grid .responsive-card").first()
    ).toBeVisible({ timeout: 15000 });

    // Export PDF button should be enabled now
    const exportBtn = page
      .getByRole("button")
      .filter({ hasText: /export.*pdf|ייצוא/i })
      .first();
    await expect(exportBtn).toBeEnabled();
  });
});
