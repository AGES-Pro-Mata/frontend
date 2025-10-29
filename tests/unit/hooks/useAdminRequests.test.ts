import { renderHookWithProviders } from "@/test/test-utils";
import { useAdminRequests } from "@/hooks/useAdminRequests";
import { type Mock, vi } from "vitest";
import * as coreApi from "@/core/api";
import { waitFor } from "@testing-library/react";

vi.mock("@/core/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));

describe("useAdminRequests", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fetches requests and approves an id (invalidate called)", async () => {
    const resp = { data: [{ id: "r1" }] };

    ((coreApi.api.get as unknown) as Mock).mockResolvedValue(resp);
    ((coreApi.api.post as unknown) as Mock).mockResolvedValue({ data: { ok: true } });

  const { result, queryClient } = renderHookWithProviders(() => useAdminRequests({ page: 1 }));

  await waitFor(() => expect(result.current.requestsQuery.data).toEqual(resp.data));

  // spy on invalidateQueries to ensure onSuccess did call it
  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

  // call approveMutation
  await result.current.approveMutation.mutateAsync("r1");

  // ensure post was called

  expect((coreApi.api.post as unknown as Mock)).toHaveBeenCalled();
  // and that invalidateQueries was invoked for adminRequests
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["adminRequests"] });
  });

  it("passes status param when provided and fetches accordingly", async () => {
    const resp = { data: [{ id: "r-status" }] };

    ((coreApi.api.get as unknown) as Mock).mockResolvedValue(resp);

    const { result } = renderHookWithProviders(() => useAdminRequests({ page: 1, status: "APPROVED" }));

    await waitFor(() => expect(result.current.requestsQuery.data).toEqual(resp.data));

    // ensure get was called with params including status
    expect((coreApi.api.get as unknown as Mock)).toHaveBeenCalledWith("/api/requests", {
      params: { page: 1, limit: 10, status: "APPROVED" },
    });
  });
});
