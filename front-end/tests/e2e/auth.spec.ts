import { test, expect } from "@playwright/test";

test.describe("Auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show error message for invalid credentials", async ({
    page,
  }) => {
    const username = page.getByRole("textbox", { name: /username/i });
    const password = page.getByRole("textbox", { name: /password/i });
    const loginButton = page.getByRole("button", { name: /login/i });

    await username.fill("aaaaaa");
    await password.fill("xxxxxxxxx");
    await loginButton.click();

    // Assert error message appears
    await expect(page.getByText(/invalid username or password/i)).toBeVisible();

    // Close the error message if it exists
    const closeButton = page.getByRole("button", { name: /close|סגור/i });
    if (await closeButton.count()) {
      await closeButton.first().click();
    }
  });

  test("should login successfully as admin and redirect to /home", async ({
    page,
  }) => {
    const username = page.getByRole("textbox", { name: /username/i });
    const password = page.getByRole("textbox", { name: /password/i });
    const loginButton = page.getByRole("button", { name: /login/i });

    await username.fill("admin");
    await password.fill("adminadmin");
    await loginButton.click();

    await expect(page).toHaveURL(/\/home$/);
  });
});
