import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/api", () => ({
  api: { post: vi.fn() },
}));

import { api } from "@/core/api";
import { addPeopleMyReservations, cancelReservation } from "@/api/reservation";

type AxiosResponse<T> = import("axios").AxiosResponse<T>;

function makeResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "",
    headers: {},
    config: {},
  } as AxiosResponse<T>;
}

describe("src/api/reservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cancelReservation posts to cancel endpoint", async () => {
    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValueOnce(makeResponse({ status: "ok" }, 200));

    await cancelReservation("123");

    expect(postSpy).toHaveBeenCalledWith("reservation/group/123/request/cancel");
  });

  it("addPeopleMyReservations forwards payload", async () => {
    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValueOnce(makeResponse({ success: true }, 200));

    const payload = [
      { name: "Ana", phone: "123", document: "ABC", gender: "F" },
      { name: "Joao", phone: "456", document: "DEF", gender: "M" },
    ];

    await addPeopleMyReservations("group-1", payload);

    expect(postSpy).toHaveBeenCalledWith("reservation/group/group-1/members", payload);
  });
});
