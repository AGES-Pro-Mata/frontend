import { expect, test } from "@playwright/test";

test.describe("Auth", () => {
  test("should display login link", async ({ page }) => {
    await page.goto("/");

    const entryPoints = page.getByRole("link", { name: /entrar|login/i });
    await expect(entryPoints).toHaveCount(1);
  });

  test.fixme("completes happy path login (to be implemented)", async () => {
    // Document future work so contributors know where to start.
  });
});
