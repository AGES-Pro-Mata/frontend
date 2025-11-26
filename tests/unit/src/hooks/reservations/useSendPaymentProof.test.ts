vi.mock("@/api/my-reservations", () => ({
  sendPaymentProof: vi.fn(),
}));

const invalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: (opts: {
    mutationFn: (params: { reservationGroupId: string; file: File }) => Promise<unknown>;
    onSuccess?: () => Promise<void> | void;
  }) => ({
    mutateAsync: async (params: { reservationGroupId: string; file: File }) => {
      const res = await opts.mutationFn(params);
      
      await opts.onSuccess?.();

      return res;
    },
  }),
  useQueryClient: () => ({ invalidateQueries }),
}));

import { sendPaymentProof } from "@/api/my-reservations";
import { useSendPaymentProof } from "@/hooks/reservations/useSendPaymentProof";
import { MY_RESERVATION_KEY } from "@/hooks/reservations/useMyReservations";

describe("useSendPaymentProof", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls api and invalidates cache on success", async () => {
    const hook = useSendPaymentProof();
    const file = new File(["x"], "x.pdf", { type: "application/pdf" });

    await hook.mutateAsync({ reservationGroupId: "gid", file });

    expect(sendPaymentProof).toHaveBeenCalledWith("gid", file);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [MY_RESERVATION_KEY],
    });
  });
});
