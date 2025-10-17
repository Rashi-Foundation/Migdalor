import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
  });

  test("desktop nav links navigate to correct routes", async ({ page }) => {
    const paths = [
      "/home",
      "/station",
      "/employees",
      "/production",
      "/reports",
      "/settings",
    ];

    for (const to of paths) {
      const link = page.locator(`nav a[href="${to}"]`).first();
      await expect(
        link,
        `Expected nav link to ${to} to be visible`
      ).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${to}$`));
    }
  });

  test("menu toggle reveals logout action", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /toggle menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    const logoutBtn = page.getByRole("button", { name: /logout|התנתקות/i });
    await expect(logoutBtn).toBeVisible();
  });
});
