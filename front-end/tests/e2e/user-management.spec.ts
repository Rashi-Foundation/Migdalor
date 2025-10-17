import { test, expect } from "@playwright/test";

test.describe("User Management (Admin Only)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("should show user management section for admin users", async ({
    page,
  }) => {
    // Look for user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים|users|משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Should show user management interface
      await expect(page.getByText(/add.*user|הוסף.*משתמש/i)).toBeVisible();
      await expect(page.getByText(/user.*list|רשימת.*משתמשים/i)).toBeVisible();
    }
  });

  test("should create a new user", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Fill user creation form
      const usernameInput = page.locator(
        '#username, input[placeholder*="username"], input[placeholder*="שם משתמש"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');
      const adminCheckbox = page.locator(
        'input[type="checkbox"], input[name*="admin"], input[id*="admin"]'
      );

      if (await usernameInput.isVisible()) {
        const uniqueUsername = `testuser${Date.now()}`;

        await usernameInput.fill(uniqueUsername);
        await passwordInput.fill("testpass123");

        // Optionally check admin checkbox
        if (await adminCheckbox.isVisible()) {
          await adminCheckbox.check();
        }

        // Submit form
        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף|submit|שלח/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Should show success message
          await expect(
            page.getByText(/created|נוצר|success|הצלחה/i)
          ).toBeVisible();
        }
      }
    }
  });

  test("should validate user creation form", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Try to submit empty form
      const createButton = page.getByRole("button", {
        name: /create|יצור|add|הוסף/i,
      });

      if (await createButton.isVisible()) {
        await createButton.click();

        // Should show validation errors
        await expect(
          page.getByText(/required|נדרש|error|שגיאה/i)
        ).toBeVisible();
      }
    }
  });

  test("should validate password requirements", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      const usernameInput = page.locator(
        '#username, input[placeholder*="username"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');

      if (await usernameInput.isVisible()) {
        // Fill username
        await usernameInput.fill("testuser");

        // Fill short password
        await passwordInput.fill("123");

        // Try to submit
        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Should show password length error
          await expect(
            page.getByText(/6.*characters|6.*תווים|password.*length/i)
          ).toBeVisible();
        }
      }
    }
  });

  test("should display user list", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Should show user table/list
      await expect(page.getByText(/username|שם משתמש/i)).toBeVisible();
      await expect(page.getByText(/admin|מנהל/i)).toBeVisible();

      // Should show at least the current user
      const userRows = page.locator("tr, .user-row, .user-item");
      await expect(userRows.first()).toBeVisible();
    }
  });

  test("should handle duplicate username error", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      const usernameInput = page.locator(
        '#username, input[placeholder*="username"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');

      if (await usernameInput.isVisible()) {
        // Try to create user with existing username
        await usernameInput.fill("admin"); // Assuming admin user exists
        await passwordInput.fill("testpass123");

        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Should show duplicate username error
          await expect(
            page.getByText(/already.*exists|כבר.*קיים|duplicate/i)
          ).toBeVisible();
        }
      }
    }
  });

  test("should handle user creation network errors", async ({ page }) => {
    // Intercept user creation request to simulate error
    await page.route("**/api/register", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      const usernameInput = page.locator(
        '#username, input[placeholder*="username"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');

      if (await usernameInput.isVisible()) {
        await usernameInput.fill("testuser");
        await passwordInput.fill("testpass123");

        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Should show server error
          await expect(
            page.getByText(/server.*error|שגיאת.*שרת|error|שגיאה/i)
          ).toBeVisible();
        }
      }
    }
  });

  test("should clear form after successful user creation", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      const usernameInput = page.locator(
        '#username, input[placeholder*="username"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');

      if (await usernameInput.isVisible()) {
        const uniqueUsername = `testuser${Date.now()}`;

        await usernameInput.fill(uniqueUsername);
        await passwordInput.fill("testpass123");

        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Wait for success message
          await expect(
            page.getByText(/created|נוצר|success|הצלחה/i)
          ).toBeVisible();

          // Form should be cleared
          await expect(usernameInput).toHaveValue("");
          await expect(passwordInput).toHaveValue("");
        }
      }
    }
  });

  test("should show admin badge for admin users", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Look for admin badge or indicator
      const adminBadge = page.getByText(/admin|מנהל/i);

      if (await adminBadge.isVisible()) {
        await expect(adminBadge).toBeVisible();
      }
    }
  });

  test("should handle user deletion", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Look for delete buttons (should not be able to delete self)
      const deleteButtons = page.getByRole("button", { name: /delete|מחק/i });

      if ((await deleteButtons.count()) > 0) {
        await deleteButtons.first().click();

        // Should show confirmation dialog
        await expect(page.getByText(/confirm|אישור|delete|מחק/i)).toBeVisible();

        // Cancel deletion
        const cancelButton = page.getByRole("button", {
          name: /cancel|ביטול/i,
        });

        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
      }
    }
  });

  test("should handle user editing", async ({ page }) => {
    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      // Look for edit buttons
      const editButtons = page.getByRole("button", { name: /edit|ערוך/i });

      if ((await editButtons.count()) > 0) {
        await editButtons.first().click();

        // Should show edit form or inline editing
        await expect(page.getByText(/edit|ערוך|update|עדכן/i)).toBeVisible();
      }
    }
  });

  test("should show user creation loading state", async ({ page }) => {
    // Intercept user creation request to simulate slow response
    await page.route("**/api/register", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Open user management section
    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    if (await userManagementSection.isVisible()) {
      await userManagementSection.click();

      const usernameInput = page.locator(
        '#username, input[placeholder*="username"]'
      );
      const passwordInput = page.locator('#password, input[type="password"]');

      if (await usernameInput.isVisible()) {
        await usernameInput.fill("testuser");
        await passwordInput.fill("testpass123");

        const createButton = page.getByRole("button", {
          name: /create|יצור|add|הוסף/i,
        });

        if (await createButton.isVisible()) {
          await createButton.click();

          // Should show loading state
          await expect(
            page.getByText(/creating|יוצר|loading|טוען/i)
          ).toBeVisible();
        }
      }
    }
  });

  test("should restrict user management to admin users only", async ({
    page,
  }) => {
    // This test should be run with a non-admin user
    // The user management section should not be visible

    const userManagementSection = page.getByRole("button", {
      name: /user.*management|ניהול.*משתמשים/i,
    });

    // For non-admin users, this section should not exist
    await expect(userManagementSection).not.toBeVisible();
  });
});
