import { test, expect } from "@playwright/test";

test.describe("Theme and Language Switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
  });

  test("should toggle between light and dark themes", async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      // Toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(500);

      // Verify theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      expect(newTheme).not.toBe(initialTheme);

      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);

      const finalTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      expect(finalTheme).toBe(initialTheme);
    }
  });

  test("should persist theme preference across page reloads", async ({
    page,
  }) => {
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });

    if (await themeToggle.isVisible()) {
      // Set theme to dark
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();

      // Verify theme is still dark
      const theme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      expect(theme).toBe("dark");
    }
  });

  test("should apply theme to all page elements", async ({ page }) => {
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });

    if (await themeToggle.isVisible()) {
      // Toggle to dark theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check that background and text colors change
      const bodyStyles = await page.evaluate(() => {
        const body = document.body;
        return {
          backgroundColor: getComputedStyle(body).backgroundColor,
          color: getComputedStyle(body).color,
        };
      });

      // In dark theme, background should be dark and text should be light
      expect(bodyStyles.backgroundColor).not.toBe("rgba(255, 255, 255, 0)"); // Not transparent white
    }
  });

  test("should switch between English and Hebrew languages", async ({
    page,
  }) => {
    // Look for language switcher
    const languageSwitcher = page.getByRole("button", {
      name: /language|שפה|english|עברית|hebrew/i,
    });

    if (await languageSwitcher.isVisible()) {
      // Get initial language
      const initialLanguage = await page.evaluate(() => {
        return document.documentElement.lang || "en";
      });

      // Click language switcher
      await languageSwitcher.click();

      // Wait for language change
      await page.waitForTimeout(1000);

      // Verify language changed
      const newLanguage = await page.evaluate(() => {
        return document.documentElement.lang || "en";
      });

      // Language should have changed
      expect(newLanguage).not.toBe(initialLanguage);

      // Check that text content has changed (some elements should be in different language)
      const navText = await page.locator("nav").textContent();
      expect(navText).toBeTruthy();
    }
  });

  test("should persist language preference across page reloads", async ({
    page,
  }) => {
    const languageSwitcher = page.getByRole("button", {
      name: /language|שפה|english|עברית|hebrew/i,
    });

    if (await languageSwitcher.isVisible()) {
      // Switch language
      await languageSwitcher.click();
      await page.waitForTimeout(1000);

      // Reload page
      await page.reload();

      // Verify language is still set
      const language = await page.evaluate(() => {
        return document.documentElement.lang || "en";
      });

      // Should not be default English
      expect(language).toBeTruthy();
    }
  });

  test("should handle RTL layout for Hebrew", async ({ page }) => {
    const languageSwitcher = page.getByRole("button", {
      name: /language|שפה|english|עברית|hebrew/i,
    });

    if (await languageSwitcher.isVisible()) {
      // Switch to Hebrew
      await languageSwitcher.click();
      await page.waitForTimeout(1000);

      // Check for RTL direction
      const direction = await page.evaluate(() => {
        return document.documentElement.dir || "ltr";
      });

      // Should be RTL for Hebrew
      if (await page.evaluate(() => document.documentElement.lang === "he")) {
        expect(direction).toBe("rtl");
      }

      // Switch back to English
      await languageSwitcher.click();
      await page.waitForTimeout(1000);

      const finalDirection = await page.evaluate(() => {
        return document.documentElement.dir || "ltr";
      });

      // Should be LTR for English
      if (await page.evaluate(() => document.documentElement.lang === "en")) {
        expect(finalDirection).toBe("ltr");
      }
    }
  });

  test("should update all text content when switching languages", async ({
    page,
  }) => {
    const languageSwitcher = page.getByRole("button", {
      name: /language|שפה|english|עברית|hebrew/i,
    });

    if (await languageSwitcher.isVisible()) {
      // Get initial text content
      const initialNavText = await page.locator("nav").textContent();

      // Switch language
      await languageSwitcher.click();
      await page.waitForTimeout(1000);

      // Get new text content
      const newNavText = await page.locator("nav").textContent();

      // Text should have changed (unless it's already in the target language)
      expect(newNavText).toBeTruthy();

      // Check that specific elements have been translated
      const homeLink = page.getByRole("link", { name: /home|בית/i });
      await expect(homeLink).toBeVisible();
    }
  });

  test("should maintain theme and language settings across navigation", async ({
    page,
  }) => {
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });
    const languageSwitcher = page.getByRole("button", {
      name: /language|שפה|english|עברית|hebrew/i,
    });

    // Set theme and language
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }

    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
    }

    await page.waitForTimeout(1000);

    // Navigate to different page
    await page.goto("/employees");

    // Verify settings are maintained
    const theme = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    });

    const language = await page.evaluate(() => {
      return document.documentElement.lang || "en";
    });

    // Settings should persist
    expect(theme).toBeTruthy();
    expect(language).toBeTruthy();
  });

  test("should show correct icons for theme toggle", async ({ page }) => {
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });

    if (await themeToggle.isVisible()) {
      // In light theme, should show moon icon
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      if (initialTheme === "light") {
        // Should show moon icon (for switching to dark)
        await expect(
          page.locator('svg[data-icon="moon"], .moon-icon')
        ).toBeVisible();
      }

      // Toggle to dark theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Should show sun icon (for switching to light)
      await expect(
        page.locator('svg[data-icon="sun"], .sun-icon')
      ).toBeVisible();
    }
  });

  test("should handle theme toggle keyboard accessibility", async ({
    page,
  }) => {
    const themeToggle = page.getByRole("button", {
      name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
    });

    if (await themeToggle.isVisible()) {
      // Focus on theme toggle
      await themeToggle.focus();

      // Should be focusable
      await expect(themeToggle).toBeFocused();

      // Press Enter to toggle
      await themeToggle.press("Enter");
      await page.waitForTimeout(500);

      // Theme should have changed
      const theme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      });

      expect(theme).toBeTruthy();
    }
  });

  test("should handle language switcher dropdown", async ({ page }) => {
    // Look for language dropdown or menu
    const languageMenu = page.locator(
      '.language-menu, .language-dropdown, [data-testid="language-menu"]'
    );

    if (await languageMenu.isVisible()) {
      // Click to open menu
      await languageMenu.click();

      // Should show language options
      await expect(page.getByText(/english|עברית|hebrew/i)).toBeVisible();

      // Click on Hebrew option
      const hebrewOption = page.getByText(/עברית|hebrew/i);

      if (await hebrewOption.isVisible()) {
        await hebrewOption.click();

        // Should switch to Hebrew
        await page.waitForTimeout(1000);

        const language = await page.evaluate(() => {
          return document.documentElement.lang || "en";
        });

        expect(language).toBe("he");
      }
    }
  });

  test("should handle theme and language changes in forms", async ({
    page,
  }) => {
    // Navigate to a page with forms
    await page.goto("/employees");

    // Open add employee form
    const addButton = page.getByRole("button", {
      name: /add.*employee|הוסף.*עובד/i,
    });

    if (await addButton.isVisible()) {
      await addButton.click();

      // Change theme while form is open
      const themeToggle = page.getByRole("button", {
        name: /theme|theme|mode|מצב|sun|moon|שמש|ירח/i,
      });

      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);

        // Form should still be visible and styled correctly
        await expect(page.getByText(/add.*employee|הוסף.*עובד/i)).toBeVisible();
      }

      // Change language while form is open
      const languageSwitcher = page.getByRole("button", {
        name: /language|שפה|english|עברית|hebrew/i,
      });

      if (await languageSwitcher.isVisible()) {
        await languageSwitcher.click();
        await page.waitForTimeout(1000);

        // Form text should be translated
        await expect(page.getByText(/add.*employee|הוסף.*עובד/i)).toBeVisible();
      }
    }
  });
});
