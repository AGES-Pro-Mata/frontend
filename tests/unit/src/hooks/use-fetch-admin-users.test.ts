import { renderHookWithProviders } from "@/test/test-utils";
import { useFetchAdminUsers } from "@/hooks/use-fetch-admin-users";
import { type Mock, vi } from "vitest";
import * as coreApi from "@/core/api";
import { waitFor } from "@testing-library/react";
import type { TUserAdminRequestFilters } from "@/entities/user-admin-filters";

vi.mock("@/core/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("useFetchAdminUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches paginated users and returns items + meta", async () => {
    const responseData = {
      items: [{ id: "u1", name: "User 1" }],
      total: 1,
      page: 1,
      limit: 10,
    };

    (coreApi.api.get as unknown as Mock).mockResolvedValue({
      data: responseData,
    });

    const { result } = renderHookWithProviders(() =>
      useFetchAdminUsers({ filters: {} as unknown as TUserAdminRequestFilters })
    );

    await waitFor(() => expect(result.current.items.length).toBe(1));

    expect(result.current.meta.total).toBe(1);
  });
});
