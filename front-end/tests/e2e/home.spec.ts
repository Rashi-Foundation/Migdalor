import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
  });

  test("renders navbar and key widgets with numeric values", async ({
    page,
  }) => {
    // Navbar logo
    await expect(page.getByRole("img", { name: /logo/i })).toBeVisible();
    // Skip asserting specific time text to reduce flakiness

    // UpdatesCards: assert there are 4 summary cards with numeric values
    const cards = page.locator(
      ".responsive-container .responsive-grid .responsive-card"
    );
    await expect(cards).toHaveCount(4, { timeout: 10000 });
    for (let i = 0; i < 4; i++) {
      const valueText = await cards
        .nth(i)
        .locator("span.text-2xl, span.text-3xl, span.text-4xl")
        .first()
        .textContent();
      expect(valueText).toMatch(/\d+/);
    }

    // ProductionEfficiencyChart: shows percentage and two numeric counters
    const percent = page.locator("text=%").first();
    await expect(percent).toBeVisible();
    const stats = page.locator(".grid.grid-cols-2 div.text-2xl");
    await expect(stats.nth(0)).toBeVisible();
    await expect(stats.nth(1)).toBeVisible();
    expect(await stats.nth(0).textContent()).toMatch(/\d+/);
    expect(await stats.nth(1).textContent()).toMatch(/\d+/);
  });
});
