import { describe, expect, it } from "vitest";
import { CheckCircle2, Clock5, XCircle } from "lucide-react";

import {
  RESERVATIONS_STATUS_STYLES,
  StatusEnum,
  getReservationStatusStyle,
} from "@/entities/reservation-status";

describe("reservation status styles", () => {
  it("returns the correct style for confirmed reservations", () => {
    const style = getReservationStatusStyle(StatusEnum.CONFIRMADA);

    expect(style.className).toBe("text-contrast-green");
    expect(style.icon.type).toBe(CheckCircle2);
  });

  it("uses the warning icon for pending statuses", () => {
    const statuses = [
      StatusEnum.PAGAMENTO_PENDENTE,
      StatusEnum.CADASTRO_PENDENTE,
      StatusEnum.AGUARDANDO_APROVACAO,
    ];

    statuses.forEach((status) => {
      const style = getReservationStatusStyle(status);

      expect(style.className).toBe("text-warning");
      expect(style.icon.type).toBe(Clock5);
    });
  });

  it("uses neutral styling for cancelations and unknown values", () => {
    const cancelada = getReservationStatusStyle(StatusEnum.CANCELADA);
    const desconhecido = getReservationStatusStyle(StatusEnum.DESCONHECIDO);

    expect(cancelada.className).toBe("text-default-red");
    expect(cancelada.icon.type).toBe(XCircle);

    expect(desconhecido.className).toBe("text-on-banner-text");
    expect(desconhecido.icon.type).toBe(XCircle);
  });

  it("tracks every status in the exported map", () => {
    const styleKeys = Object.keys(RESERVATIONS_STATUS_STYLES).sort();
    const statusValues = [...Object.values(StatusEnum)].sort();

    expect(styleKeys).toEqual(statusValues);
  });
});
