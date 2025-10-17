import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("shows header and can interact with sections and inputs", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /settings/i })
    ).toBeVisible();
    // Account collapsible button contains translated title
    await expect(
      page.getByRole("button", { name: /account|חשבון|account/i })
    ).toBeVisible();

    // Open Security and verify password inputs exist
    const securityToggle = page.getByRole("button", {
      name: /security|אבטחה/i,
    });
    await securityToggle.click();
    const newPass = page.getByPlaceholder(/enter new password/i);
    const confirmPass = page.getByPlaceholder(/confirm new password/i);
    await expect(newPass).toBeVisible({ timeout: 5000 });
    await expect(confirmPass).toBeVisible({ timeout: 5000 });

    // Fill inputs and verify button state toggles
    await newPass.fill("abcdef");
    await confirmPass.fill("abcdef");
    // Scope the Change Password button to the same rounded section container
    const section = newPass
      .locator('xpath=ancestor::div[contains(@class, "rounded-xl")]')
      .first();
    await section.waitFor({ state: "visible" });
    const changeBtn = section
      .getByRole("button")
      .filter({ hasText: /change|password|update|עדכון|סיסמה/i })
      .first();
    await expect(changeBtn).toBeEnabled({ timeout: 5000 });
  });
});
