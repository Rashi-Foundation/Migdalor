import { test as setup, expect } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

const STORAGE_STATE = "tests/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/");

  // Wait for form fields to be ready
  const userInput = page.getByRole("textbox", { name: /username/i });
  const passInput = page.getByRole("textbox", { name: /password/i });
  await userInput.waitFor({ state: "visible" });
  await passInput.waitFor({ state: "visible" });

  // Attempt login with retry to handle backend warm-up
  const loginButton = page.getByRole("button", { name: /login/i });
  let loggedIn = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await userInput.fill("admin");
    await passInput.fill("adminadmin");
    await loginButton.click();
    try {
      await expect(page).toHaveURL(/\/home$/, { timeout: 8000 });
      loggedIn = true;
      break;
    } catch {
      const authError = page.getByText(/invalid username or password/i);
      if (await authError.isVisible({ timeout: 500 }).catch(() => false)) {
        break;
      }
      await page.waitForTimeout(1000 * attempt);
    }
  }
  await expect(
    loggedIn,
    "Failed to navigate to /home after login attempts"
  ).toBeTruthy();

  // Verify Home is rendered
  await expect(page.getByRole("img", { name: /logo/i })).toBeVisible({
    timeout: 15000,
  });

  // Ensure directory exists before writing storage state
  const dir = path.dirname(STORAGE_STATE);
  await mkdir(dir, { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
});
