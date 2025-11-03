import { renderWithProviders } from "@/test/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

import { Toaster } from "@/components/ui/sonner";

describe("Toaster (sonner)", () => {
  it("renders the Sonner Toaster with expected class", () => {
    const { container } = renderWithProviders(<Toaster />);

    expect(container).toBeInTheDocument();
  });
});
