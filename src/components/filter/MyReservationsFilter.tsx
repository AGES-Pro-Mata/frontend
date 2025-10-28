import type { TMyReservationsFilters } from "@/entities/my-reservations-filter";
import { StatusEnum } from "@/entities/reservation-status";
import { type FilterOption, FilterPanel, type FilterTranslations } from "@/components/filter/FilterPanel";

const reservationStatusOptions: FilterOption[] = [
	{ value: "all", labelKey: "myReservationsFilter.status.all" },
	...Object.values(StatusEnum)
		.filter((status) => status !== StatusEnum.DESCONHECIDO)
		.map((status) => ({
			value: status,
			labelKey: `status.${status}`,
		})),
];

const myReservationsTranslations: Partial<FilterTranslations> = {
	searchPlaceholderKey: "myReservationsFilter.searchPlaceholder",
	searchAriaLabelKey: "myReservationsFilter.searchAriaLabel",
};

export function MyReservationsFilter({ className }: { className?: string } = {}) {
	return (
		<FilterPanel<TMyReservationsFilters>
			filtersKey="my-reservations"
			initialFilters={{
				limit: 10,
				page: 0,
				status: "all",
			}}
			toggleKey="status"
			options={reservationStatusOptions}
			translations={myReservationsTranslations}
			className={className}
		/>
	);
}
