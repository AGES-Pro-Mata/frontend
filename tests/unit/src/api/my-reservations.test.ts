vi.mock("@/core/api", () => ({ api: { post: vi.fn() } }));

import { api } from "@/core/api";
import { sendPaymentProof } from "@/api/my-reservations";

describe("src/api/my-reservations", () => {
  it("sends payment proof with multipart form data", async () => {
    const file = new File(["proof"], "proof.pdf", { type: "application/pdf" });
    const postResponse: import("axios").AxiosResponse<{ ok: boolean }> = {
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    };

    const postSpy = vi.spyOn(api, "post").mockResolvedValue(postResponse);

    const result = await sendPaymentProof("group-1", file);

    expect(result).toEqual({ ok: true });
    expect(postSpy).toHaveBeenCalledWith(
      "/reservation/group/group-1/request/receipt",
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );

    const form = postSpy.mock.calls[0][1] as FormData;

    expect(form.get("paymentReceipt")).toBe(file);
  });
});
