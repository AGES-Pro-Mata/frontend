import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FaRegCalendarCheck, FaUser } from "react-icons/fa";

import ReservationRequestsTable from "./reservations/requests-table";

export const Route = createFileRoute("/admin/requests/$tab")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tab } = Route.useParams();

  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white rounded-xl shadow flex flex-col gap-4 h-full">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "professor" ? "bg-contrast-green text-white" : "bg-soft-gray text-gray-700"
          }`}
          onClick={() => {
            void navigate({ to: "/admin/requests/$tab", params: { tab: "professor" } });
          }}
        >
          <FaUser size={24} /> Professor Requests
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "reservation" ? "bg-contrast-green text-white" : "bg-soft-gray text-gray-700"
          }`}
          onClick={() => {
            void navigate({ to: "/admin/requests/$tab", params: { tab: "reservation" } });
          }}
        >
          <FaRegCalendarCheck size={24} /> Reservation Requests
        </button>
      </div>
      <div className="h-full">
        {/* {tab === "professor" && <ProfessorRequestsTable />} */}
        {tab === "reservation" && <ReservationRequestsTable />}
      </div>
    </div>
  );
}
