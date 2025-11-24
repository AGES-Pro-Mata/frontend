import type { AxiosResponse } from "axios";
import { type Mock, vi } from "vitest";

vi.mock("@/core/api", () => ({ api: { post: vi.fn() } }));
vi.mock("@/core/http/safe-api-caller", () => ({ safeApiCall: vi.fn() }));

import { api } from "@/core/api";
import { safeApiCall } from "@/core/http/safe-api-caller";
import { createGroupReservation } from "@/api/reserve";

describe("src/api/reserve", () => {
  it("delegates to safeApiCall with payload and schema", async () => {
    const payload = {
      allowPostConfirmation: true,
      notes: "abc",
      members: [],
      reservations: [],
    } satisfies Parameters<typeof createGroupReservation>[0];

    const response = {
      data: { data: "ok" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as AxiosResponse["config"],
    } as unknown as AxiosResponse<{ data: string }>;

    const postPromise = Promise.resolve(response);
    const postSpy = vi.spyOn(api, "post").mockReturnValue(postPromise);

    const safeApiCallMock = safeApiCall as Mock;

    safeApiCallMock.mockResolvedValue({ parsed: true });

    const res = await createGroupReservation(payload);

    expect(postSpy).toHaveBeenCalledWith("/reservation/group", payload);
    expect(safeApiCallMock).toHaveBeenCalledWith(postPromise, expect.anything());
    expect(res).toEqual({ parsed: true });
  });
});
