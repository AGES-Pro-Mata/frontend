import type { AxiosResponse } from "axios";
import { api } from "@/core/api";
import { useViewReservation } from "@/hooks/reservations/useViewReservation";

vi.mock("@/core/api", () => ({ api: { get: vi.fn() } }));

type QueryOpts = {
  queryKey: [string, string];
  queryFn: () => Promise<unknown>;
};

let lastQueryFn: QueryOpts["queryFn"] | undefined;

vi.mock("@tanstack/react-query", () => ({
  useQuery: (opts: QueryOpts) => {
    lastQueryFn = opts.queryFn;

    return { queryKey: opts.queryKey, queryFn: opts.queryFn };
  },
}));

describe("useViewReservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastQueryFn = undefined;
  });

  it("fetches user and admin reservation routes", async () => {
    const getSpy = vi
      .spyOn(api, "get")
      .mockResolvedValue({ data: { id: "1" } } as AxiosResponse<{ id: string }>);

    const userQuery = useViewReservation("rid") as unknown as { queryKey: [string, string] };

    await lastQueryFn?.();
    expect(getSpy).toHaveBeenCalledWith("/reservation/group/user/rid");
    expect(userQuery.queryKey).toEqual(["viewReservation", "rid"]);

    useViewReservation("admin-id", true);
    await lastQueryFn?.();
    expect(getSpy).toHaveBeenCalledWith("/reservation/group/admin/admin-id");
  });
});
