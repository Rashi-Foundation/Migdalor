import { Page, expect } from "@playwright/test";

export async function login(
  page: Page,
  username = "admin",
  password = "adminadmin"
) {
  await page.goto("/");
  await page.getByRole("textbox", { name: /username/i }).fill(username);
  await page.getByRole("textbox", { name: /password/i }).fill(password);
  await page.getByRole("button", { name: /login/i }).click();
  await expect(page).toHaveURL(/\/home$/);
}
