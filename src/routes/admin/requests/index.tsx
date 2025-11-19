import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FaRegCalendarCheck, FaUser } from "react-icons/fa";

import ReservationRequestsTable from "./-components/requests-table";

export const Route = createFileRoute("/admin/requests/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "reservation",
    };
  },
});

function RouteComponent() {
  const { tab } = Route.useSearch();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6 overflow-hidden">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "professor" ? "bg-contrast-green text-white" : "bg-soft-gray text-gray-700"
          }`}
          onClick={() => {
            void navigate({ to: "/admin/requests", search: { tab: "professor" } });
          }}
        >
          <FaUser size={24} /> Solicitações de Professores
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "reservation" ? "bg-contrast-green text-white" : "bg-soft-gray text-gray-700"
          }`}
          onClick={() => {
            void navigate({ to: "/admin/requests", search: { tab: "reservation" } });
          }}
        >
          <FaRegCalendarCheck size={24} /> Solicitações de Reservas
        </button>
      </div>
      {/* {tab === "professor" && <ProfessorRequestsTable />} */}
      {tab === "reservation" && <ReservationRequestsTable />}
    </div>
  );
}
