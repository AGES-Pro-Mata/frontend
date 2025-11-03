import { renderHookWithProviders } from "@/test/test-utils";
import { useUpdateAdminUser } from "@/hooks/useUpdateAdminUser";
import * as userApi from "@/api/user";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/user", () => ({ updateUserRequest: vi.fn() }));

describe("useUpdateAdminUser", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls updateUserRequest and resolves", async () => {
    const resp = { statusCode: 200 };

    (userApi.updateUserRequest as unknown as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useUpdateAdminUser());

    // provide a properly-typed empty payload to avoid unsafe any
    const payload = {
      name: "n",
      email: "e@e.com",
      password: "p",
      phone: "111",
      gender: "x",
      country: "c",
      userType: "ADMIN",
      isForeign: false,
      zipCode: "123",
    } as Parameters<typeof userApi.updateUserRequest>[0];

    await result.current.mutateAsync({ id: "u1", payload });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
