import { test, expect } from "@playwright/test";

test.describe("Production Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/production");
    await expect(
      page.getByRole("heading", { name: /production|ייצור/i })
    ).toBeVisible();
  });
});
