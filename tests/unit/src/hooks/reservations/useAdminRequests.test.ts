import type { AxiosResponse } from "axios";
import { api } from "@/core/api";
import { useAdminRequests } from "@/hooks/reservations/useAdminRequests";

vi.mock("@/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

const invalidateQueries = vi.fn();

type QueryOpts = {
  queryKey: [string, { limit: number; page: number; status?: string }];
  queryFn: () => Promise<unknown>;
};

type MutationOpts = {
  mutationFn: (id: string) => Promise<unknown>;
  onSuccess?: () => Promise<void> | void;
};

let capturedQueryFn: QueryOpts["queryFn"] | undefined;

vi.mock("@tanstack/react-query", () => ({
  useQuery: (opts: QueryOpts) => {
    capturedQueryFn = opts.queryFn;

    return { data: null, queryKey: opts.queryKey };
  },
  useMutation: (opts: MutationOpts) => ({
    mutateAsync: async (id: string) => {
      const res = await opts.mutationFn(id);

      await opts.onSuccess?.();

      return res;
    },
  }),
  useQueryClient: () => ({ invalidateQueries }),
}));

describe("useAdminRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedQueryFn = undefined;
  });

  it("fetches with and without status and invalidates on approve", async () => {
    const getSpy = vi
      .spyOn(api, "get")
      .mockResolvedValue({ data: [{ id: 1 }] } as AxiosResponse<Array<{ id: number }>>);
    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue({ data: { ok: true } } as AxiosResponse<{ ok: boolean }>);

    const { approveMutation } = useAdminRequests({
      page: 2,
      limit: 5,
      status: "APPROVED",
    });

    await capturedQueryFn?.();
    expect(getSpy).toHaveBeenCalledWith("/api/requests", {
      params: { page: 2, limit: 5, status: "APPROVED" },
    });

    useAdminRequests({}); // default branch with no status
    await capturedQueryFn?.();
    expect(getSpy).toHaveBeenCalledWith("/api/requests", {
      params: { page: 1, limit: 10, status: undefined },
    });

    await approveMutation.mutateAsync("req-1");
    expect(postSpy).toHaveBeenCalledWith("/api/requests/req-1/approve");
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminRequests"],
    });
  });
});
