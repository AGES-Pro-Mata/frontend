import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";
import { useDeleteUser } from "@/hooks/use-delete-users";
import * as userApi from "@/api/user";
import { vi } from "vitest";
import type { AxiosResponse } from "axios";

describe("useDeleteUser", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls deleteUser and triggers refetch of admin users", async () => {
    const client = createTestQueryClient();

    const spy = vi
      .spyOn(client, "refetchQueries")
      .mockResolvedValue(undefined as unknown as void);

    const deleteSpy = vi.spyOn(userApi, "deleteUser").mockResolvedValue({
      status: 200,
      data: { statusCode: 200, message: "ok" },
    } as unknown as AxiosResponse<{ statusCode: number; message: string }>);

    const { result } = renderHookWithProviders(() => useDeleteUser(), {
      queryClient: client,
    });

    await result.current.handleDeleteUser("u1");

    expect(deleteSpy).toHaveBeenCalledWith("u1");

    expect(spy).toHaveBeenCalled();
  });
});
