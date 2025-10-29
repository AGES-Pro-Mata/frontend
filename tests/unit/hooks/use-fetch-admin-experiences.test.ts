import { renderHookWithProviders } from "@/test/test-utils";
import { useFetchAdminExperiences } from "@/hooks/use-fetch-admin-experiences";
import * as coreApi from "@/core/api";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";
import type { TExperienceAdminRequestFilters } from "@/entities/experiences-admin-filters";

vi.mock("@/core/api", () => ({ api: { get: vi.fn() } }));

describe("useFetchAdminExperiences", () => {
  afterEach(() => vi.restoreAllMocks());

  it("parses items and formats date range", async () => {
    const items = [
      {
        id: "e1",
        startDate: "2023-01-02T00:00:00.000Z",
        endDate: "2023-03-04T00:00:00.000Z",
      },
    ];

    ((coreApi.api.get as unknown) as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { items, total: 1, page: 1, limit: 10 } });

    const { result } = renderHookWithProviders(() =>
      useFetchAdminExperiences({ filters: {} as unknown as TExperienceAdminRequestFilters })
    );

    await waitFor(() => expect(result.current.items.length).toBe(1));

  const item = result.current.items[0] as unknown as { date: string };

  expect(item.date).toMatch(/^\d{2}\/\d{2}-\d{2}\/\d{2}$/);
  });

  it("returns original item when startDate or endDate missing", async () => {
    const items = [
      {
        id: "e2",
        // missing dates
      } as unknown as Record<string, unknown>,
    ];

    ((coreApi.api.get as unknown) as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { items, total: 1, page: 1, limit: 10 } });

    const { result } = renderHookWithProviders(() =>
      useFetchAdminExperiences({ filters: {} as unknown as TExperienceAdminRequestFilters })
    );

    await waitFor(() => expect(result.current.items.length).toBe(1));

  // item should be the same object (no date property added)
  const maybeItem = result.current.items[0] as Record<string, unknown>;

  expect(maybeItem.date).toBeUndefined();
  });

  it("handles empty response and returns defaults for meta and items", async () => {
  ((coreApi.api.get as unknown) as ReturnType<typeof vi.fn>).mockResolvedValue({ data: {} });

    const { result } = renderHookWithProviders(() =>
      useFetchAdminExperiences({ filters: {} as unknown as TExperienceAdminRequestFilters })
    );

    await waitFor(() => expect(result.current.items).toEqual([]));

    expect(result.current.meta).toEqual({ total: 0, page: 0, limit: 10 });
  });
});
