import { renderHookWithProviders } from "@/test/test-utils";

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ state: { location: { pathname: "/test-path" } } }),
}));

import { useCurrentPath } from "@/hooks/useCurrentPath";

describe("useCurrentPath", () => {
  it("returns the current pathname from router state", () => {
    const { result } = renderHookWithProviders(() => useCurrentPath());

    expect(result.current).toBe("/test-path");
  });
});
