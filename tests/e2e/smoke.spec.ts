import { expect, test } from "@playwright/test";

test.describe("Smoke", () => {
  test("renders landing page hero", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/pró-mata/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
