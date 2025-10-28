import type { ReservationGroupStatusFilter } from "@/hooks/useMyReservations";
import { useTranslation } from "react-i18next";

type ReservationGroupStatusFilterMap = Record<
  ReservationGroupStatusFilter,
  string
>;

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
      className={`w-full grid grid-cols-4 text-center rounded-full p-0 bg-card-light-light ${className}`}
    >
      {Object.entries(STATUS_MAP).map((e) => {
        const [entryStatus, text] = e;

        return (
          <button
            key={entryStatus}
            className={`rounded-full ${entryStatus === status ? "bg-card-light-active" : ""} py-1 ${entryStatus === status ? "" : "hover:text-card-light-plain"}`}
            onClick={() =>
              handleStatusChange(entryStatus as ReservationGroupStatusFilter)
            }
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
