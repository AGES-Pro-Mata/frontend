import { renderHookWithProviders } from "@/test/test-utils";
import { useGetAdminUser } from "@/hooks/use-get-admin-user";
import * as userApi from "@/api/user";
import { waitFor } from "@testing-library/react";
import { type Mock, vi } from "vitest";

vi.mock("@/api/user", () => ({
  getUserById: vi.fn(),
}));

describe("useGetAdminUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches user by id and exposes data", async () => {
    const payload = { id: "a1", name: "Admin" };

    (userApi.getUserById as unknown as Mock).mockResolvedValue(payload);

    const { result } = renderHookWithProviders(() =>
      useGetAdminUser({ id: "a1" })
    );

    await waitFor(() => expect(result.current.data).toEqual(payload));
  });
});
