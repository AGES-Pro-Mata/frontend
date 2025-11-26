import type { ReservationGroupStatusFilter } from "@/hooks/reservations/useMyReservations";
import { useTranslation } from "react-i18next";

type ReservationGroupStatusFilterMap = Record<ReservationGroupStatusFilter, string>;

type MyReservationsFilterCompactProps = {
  className?: string;
  status: ReservationGroupStatusFilter;
  handleStatusChange: (status: ReservationGroupStatusFilter) => void;
};

export function MyReservationsFilterCompact({
  className,
  status,
  handleStatusChange,
}: MyReservationsFilterCompactProps) {
  const { t } = useTranslation();

  const STATUS_MAP: ReservationGroupStatusFilterMap = {
    ALL: t("myReservationsFilter.status.all"),
    APPROVED: t("myReservationsFilter.status.confirmed"),
    CANCELED: t("myReservationsFilter.status.cancelled"),
    PENDING: t("myReservationsFilter.status.waiting"),
  };

  return (
    <div
      className={`w-full grid grid-cols-2 sm:grid-cols-4 text-center rounded-full bg-card-light-light p-1 overflow-hidden ${className}`}
    >
      {Object.entries(STATUS_MAP).map((e) => {
        const [entryStatus, text] = e;

        return (
          <button
            key={entryStatus}
            className={`w-full h-full flex items-center justify-center rounded-full text-sm transition-colors ${
              entryStatus === status
                ? "bg-card-light-active shadow-sm"
                : "hover:text-black/60 hover:cursor-pointer"
            }`}
            onClick={() => handleStatusChange(entryStatus as ReservationGroupStatusFilter)}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
