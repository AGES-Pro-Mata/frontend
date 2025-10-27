import { MyReservationsFilterCompact } from "@/components/filter/MyReservationsFilterCompact";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/(index)/user/my-reservations/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-4 py-10 md:px-8">
			<MyReservationsFilterCompact status={"ALL"} />
		</main>
	);
}
