import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type ReservationGroupStatus = "APPROVED" | "CANCELLED" | "CREATED" | "ALL";
type ReservationGroupStatusMap = Record<ReservationGroupStatus, string>

type MyReservationsFilterCompactProps = {
	className?: string,
	status: ReservationGroupStatus
}

export function MyReservationsFilterCompact({ className, status }: MyReservationsFilterCompactProps) {
	const { t } = useTranslation();

	const STATUS_MAP: ReservationGroupStatusMap = useMemo(() => ({
		ALL: t('myReservationsFilter.status.all'),
		APPROVED: t('myReservationsFilter.status.confirmed'),
		CANCELLED: t('myReservationsFilter.status.cancelled'),
		CREATED: t('myReservationsFilter.status.waiting'),
	}), [t]);

	return (
		<div className={`w-full grid grid-cols-4 text-center rounded-full p-0 bg-card-light-light ${className}`}>

			{Object.entries(STATUS_MAP).map(e => {
				const [entryStatus, text] = e;

				return <button key={entryStatus} className={`rounded-full ${entryStatus === status ? "bg-card-light-active" : ""} py-1 hover:bg-red`}>
					{text}
				</button>
			})}
		</div>
	);
}
