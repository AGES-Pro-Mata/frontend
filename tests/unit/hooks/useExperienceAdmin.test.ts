import { renderHookWithProviders } from "@/test/test-utils";
import { useExperienceAdmin } from "@/hooks/useExperienceAdmin";
import { waitFor } from "@testing-library/react";
import { vi } from "vitest";

const originalFetch = (globalThis as unknown as { fetch?: typeof fetch }).fetch;

describe("useExperienceAdmin", () => {
  afterEach(() => {
     // restore global fetch
     (globalThis as unknown as { fetch?: typeof fetch }).fetch = originalFetch;
  });

  it("fetches experiences via window.fetch and returns parsed json", async () => {
    const mockJson = { items: [{ id: "ex1" }], total: 1, page: 1, pageSize: 10 };

    // mock fetch to return ok and json
    const mocked = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockJson) }) as unknown as typeof fetch;

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mocked;

    const { result } = renderHookWithProviders(() => useExperienceAdmin(1, 10));

    await waitFor(() => expect(result.current.data).toEqual(mockJson));
  });

  it("throws when response is not ok", async () => {
    const mocked = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mocked;

    const { result } = renderHookWithProviders(() => useExperienceAdmin(2, 5));

    await waitFor(() => expect(result.current.isError).toBe(true));

    // error message should match the thrown message in hook
    expect((result.current.error as Error).message).toContain("Erro ao buscar experiências");
  });

  it("propagates network errors from fetch", async () => {
    const mocked = vi.fn().mockRejectedValue(new Error("network fail")) as unknown as typeof fetch;

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mocked;

    const { result } = renderHookWithProviders(() => useExperienceAdmin(3, 7));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toContain("network fail");
  });

  it("uses default params when none are provided", async () => {
    const mockJson = { items: [], total: 0, page: 1, pageSize: 10 };
    const mocked = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockJson) }) as unknown as typeof fetch;

    (globalThis as unknown as { fetch?: typeof fetch }).fetch = mocked;

    const { result } = renderHookWithProviders(() => useExperienceAdmin());

    await waitFor(() => expect(result.current.data).toEqual(mockJson));

    // ensure fetch was called with default page and pageSize
    expect(mocked).toHaveBeenCalledWith('/api/experiences?page=1&pageSize=10');
  });
});
