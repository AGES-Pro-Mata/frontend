import { beforeEach, describe, expect, it, vi } from "vitest";
import { HighlightCategory } from "@/entities/highlights";

const useQueryMock = vi.fn();
const useMutationMock = vi.fn();
const useQueryClientMock = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args) as unknown,
  useMutation: (...args: unknown[]) => useMutationMock(...args) as unknown,
  useQueryClient: () => useQueryClientMock() as unknown,
}));

const getHighlightsMock = vi.fn();
const getHighlightByIdMock = vi.fn();
const getGroupedMock = vi.fn();
const getPublicGroupedMock = vi.fn();
const createHighlightMock = vi.fn();
const updateHighlightMock = vi.fn();
const deleteHighlightMock = vi.fn();

vi.mock("@/api/highlights", () => ({
  getHighlights: (...args: unknown[]) => getHighlightsMock(...args) as unknown,
  getHighlightById: (...args: unknown[]) =>
    getHighlightByIdMock(...args) as unknown,
  getHighlightsByCategories: (...args: unknown[]) =>
    getGroupedMock(...args) as unknown,
  getPublicHighlightsByCategories: (...args: unknown[]) =>
    getPublicGroupedMock(...args) as unknown,
  createHighlight: (...args: unknown[]) =>
    createHighlightMock(...args) as unknown,
  updateHighlight: (...args: unknown[]) =>
    updateHighlightMock(...args) as unknown,
  deleteHighlight: (...args: unknown[]) =>
    deleteHighlightMock(...args) as unknown,
}));

import {
  HIGHLIGHTS_QUERY_KEY,
  useCreateHighlight,
  useDeleteHighlight,
  useFetchHighlightById,
  useFetchHighlights,
  useFetchHighlightsByCategories,
  useFetchPublicHighlightsByCategories,
  useHighlightsOperations,
  useUpdateHighlight,
} from "@/hooks/useHighlights";

describe("useHighlights hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches highlights with params", async () => {
    const params = { limit: 5 };
    const resultValue = { data: "value" };

    useQueryMock.mockReturnValueOnce(resultValue);

    const result = useFetchHighlights(params);

    const callArgs = useQueryMock.mock.calls.at(-1)![0] as {
      queryKey: unknown;
      queryFn: () => Promise<unknown>;
    };

    expect(callArgs.queryKey).toEqual([HIGHLIGHTS_QUERY_KEY, params]);
    await callArgs.queryFn();
    expect(getHighlightsMock).toHaveBeenCalledWith(params);
    expect(result).toBe(resultValue);
  });

  it("fetches a highlight by id and enables query when id is truthy", async () => {
    const resultValue = { id: "1" };

    useQueryMock.mockReturnValueOnce(resultValue);

    const result = useFetchHighlightById("1");

    const callArgs = useQueryMock.mock.calls.at(-1)![0] as {
      queryKey: unknown;
      queryFn: () => Promise<unknown>;
      enabled: boolean;
    };

    expect(callArgs.queryKey).toEqual([HIGHLIGHTS_QUERY_KEY, "1"]);
    expect(callArgs.enabled).toBe(true);
    await callArgs.queryFn();
    expect(getHighlightByIdMock).toHaveBeenCalledWith("1");
    expect(result).toBe(resultValue);
  });

  it("fetches highlights grouped by categories", async () => {
    const resultValue = { labs: [] };

    useQueryMock.mockReturnValueOnce(resultValue);

    const result = useFetchHighlightsByCategories();

    const callArgs = useQueryMock.mock.calls.at(-1)![0] as {
      queryKey: unknown;
      queryFn: () => Promise<unknown>;
    };

    expect(callArgs.queryKey).toEqual([HIGHLIGHTS_QUERY_KEY, "grouped"]);
    await callArgs.queryFn();
    expect(getGroupedMock).toHaveBeenCalled();
    expect(result).toBe(resultValue);
  });

  it("fetches public highlights grouped by categories", async () => {
    const resultValue = { labs: [] };

    useQueryMock.mockReturnValueOnce(resultValue);

    const result = useFetchPublicHighlightsByCategories();

    const callArgs = useQueryMock.mock.calls.at(-1)![0] as {
      queryKey: unknown;
      queryFn: () => Promise<unknown>;
    };

    expect(callArgs.queryKey).toEqual([
      HIGHLIGHTS_QUERY_KEY,
      "public",
      "grouped",
    ]);
    await callArgs.queryFn();
    expect(getPublicGroupedMock).toHaveBeenCalled();
    expect(result).toBe(resultValue);
  });

  it("creates highlight and invalidates cache on success", async () => {
    const invalidateMock = vi.fn();

    useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateMock });

    const mutationReturn = { mutate: vi.fn(), isPending: false };

    useMutationMock.mockReturnValueOnce(mutationReturn);

    const result = useCreateHighlight();

    const callArgs = useMutationMock.mock.calls.at(-1)![0] as {
      mutationFn: (payload: unknown) => Promise<unknown>;
      onSuccess: () => void;
    };

    await callArgs.mutationFn({ id: 1 });
    expect(createHighlightMock).toHaveBeenCalledWith({ id: 1 });

    callArgs.onSuccess();
    expect(invalidateMock).toHaveBeenCalledWith({
      queryKey: [HIGHLIGHTS_QUERY_KEY],
    });
    expect(result).toBe(mutationReturn);
  });

  it("updates highlight and invalidates cache", async () => {
    const invalidateMock = vi.fn();

    useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateMock });
    const mutationReturn = { mutate: vi.fn(), isPending: true };

    useMutationMock.mockReturnValueOnce(mutationReturn);

    const result = useUpdateHighlight();

    const callArgs = useMutationMock.mock.calls.at(-1)![0] as {
      mutationFn: (payload: {
        id: string;
        payload: unknown;
      }) => Promise<unknown>;
      onSuccess: () => void;
    };

    await callArgs.mutationFn({ id: "10", payload: { title: "x" } });
    expect(updateHighlightMock).toHaveBeenCalledWith("10", { title: "x" });

    callArgs.onSuccess();
    expect(invalidateMock).toHaveBeenCalledWith({
      queryKey: [HIGHLIGHTS_QUERY_KEY],
    });
    expect(result).toBe(mutationReturn);
  });

  it("deletes highlight and invalidates cache", async () => {
    const invalidateMock = vi.fn();

    useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateMock });
    const mutationReturn = { mutate: vi.fn(), isPending: false };

    useMutationMock.mockReturnValueOnce(mutationReturn);

    const result = useDeleteHighlight();

    const callArgs = useMutationMock.mock.calls.at(-1)![0] as {
      mutationFn: (id: string) => Promise<unknown>;
      onSuccess: () => void;
    };

    await callArgs.mutationFn("5");
    expect(deleteHighlightMock).toHaveBeenCalledWith("5");

    callArgs.onSuccess();
    expect(invalidateMock).toHaveBeenCalledWith({
      queryKey: [HIGHLIGHTS_QUERY_KEY],
    });
    expect(result).toBe(mutationReturn);
  });

  it("aggregates highlights operations helpers", () => {
    const queryResult = {
      items: [{ id: "1" }],
      total: 1,
      page: 2,
      limit: 15,
    };

    useQueryMock.mockReturnValueOnce({
      data: queryResult,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const createMutation = { mutate: vi.fn(), isPending: true };
    const updateMutation = { mutate: vi.fn(), isPending: false };
    const deleteMutation = { mutate: vi.fn(), isPending: false };

    useMutationMock
      .mockReturnValueOnce(createMutation)
      .mockReturnValueOnce(updateMutation)
      .mockReturnValueOnce(deleteMutation);

    useQueryClientMock.mockReturnValue({ invalidateQueries: vi.fn() });

    const result = useHighlightsOperations();

    expect(result.highlights).toEqual(queryResult.items);
    expect(result.meta).toEqual({ total: 1, page: 2, limit: 15 });
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
    expect(result.create).toBe(createMutation.mutate);
    expect(result.update).toBe(updateMutation.mutate);
    expect(result.delete).toBe(deleteMutation.mutate);
    expect(result.isCreating).toBe(true);
    expect(result.isUpdating).toBe(false);
    expect(result.isDeleting).toBe(false);
  });

  it("returns defaults when highlights query has no data", () => {
    const refetchMock = vi.fn();

    useQueryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: new Error("failed"),
      refetch: refetchMock,
    });

    const createMutation = { mutate: vi.fn(), isPending: false };
    const updateMutation = { mutate: vi.fn(), isPending: false };
    const deleteMutation = { mutate: vi.fn(), isPending: false };

    useMutationMock
      .mockReturnValueOnce(createMutation)
      .mockReturnValueOnce(updateMutation)
      .mockReturnValueOnce(deleteMutation);

    useQueryClientMock.mockReturnValue({ invalidateQueries: vi.fn() });

    const result = useHighlightsOperations();

    expect(result.highlights).toEqual([]);
    expect(result.meta).toEqual({ total: 0, page: 0, limit: 10 });
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.refetch).toBe(refetchMock);
  });

  it("requests highlights filtered by category when provided", () => {
    const refetchMock = vi.fn();

    useQueryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    });

    const createMutation = { mutate: vi.fn(), isPending: false };
    const updateMutation = { mutate: vi.fn(), isPending: false };
    const deleteMutation = { mutate: vi.fn(), isPending: false };

    useMutationMock
      .mockReturnValueOnce(createMutation)
      .mockReturnValueOnce(updateMutation)
      .mockReturnValueOnce(deleteMutation);

    useQueryClientMock.mockReturnValue({ invalidateQueries: vi.fn() });

    const result = useHighlightsOperations(HighlightCategory.EVENTO);

    const queryArgs = useQueryMock.mock.calls.at(-1)?.[0] as {
      queryKey: unknown;
    };

    expect(queryArgs.queryKey).toEqual([
      HIGHLIGHTS_QUERY_KEY,
      { category: HighlightCategory.EVENTO },
    ]);
    expect(result.refetch).toBe(refetchMock);
  });
});
