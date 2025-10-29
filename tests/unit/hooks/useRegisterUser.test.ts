import { renderHookWithProviders } from "@/test/test-utils";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import * as userApi from "@/api/user";
import type { RegisterUserPayload } from "@/api/user";
import { waitFor } from "@testing-library/react";
import { type Mock, vi } from "vitest";

vi.mock("@/api/user", () => ({
  registerUserRequest: vi.fn(),
}));

describe("useRegisterUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls registerUserRequest and resolves", async () => {
    const payload = { id: "u2", name: "New" };

    (userApi.registerUserRequest as unknown as Mock).mockResolvedValue(payload);

    const { result } = renderHookWithProviders(() => useRegisterUser());

  result.current.mutate({ name: "New" } as unknown as RegisterUserPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(payload);
  });
});
