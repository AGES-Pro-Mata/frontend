import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/index";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegCalendarCheck, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MdMoreVert, MdVisibility } from "react-icons/md";
import type { TRequestItem } from "@/entities/request-admin-response";
import type { TRequestAdminFilters } from "@/entities/request-admin-filters";

type Request = {
  id: string;
  name: string;
  email: string;
  status: string;
};

type RequestStatus = NonNullable<TRequestAdminFilters["status"]>[number];

const professorStatus = ["Approved", "Rejected", "Pending"];

const reservationStatus: RequestStatus[] = [
  "CREATED", // Criadas
  "APPROVED", // Aprovadas
  "CANCELED", // Canceladas
  "CANCELED_REQUESTED", // Cancelamento Solicitado
  "EDITED", // Editadas
  "REJECTED", // Rejeitadas
  "PEOPLE_REQUESTED", // Usuários Solicitado
  "PAYMENT_REQUESTED", // Pagamento Solicitado
  "PEOPLE_SENT", // Participantes Enviados
  "PAYMENT_SENT", // Pagamento Enviado
  "DOCUMENT_REQUESTED", // Documento Solicitado
  "DOCUMENT_APPROVED", // Documento Aprovado
  "DOCUMENT_REJECTED", // Documento Rejeitado
];

const statusMap: Record<RequestStatus, string> = {
  CREATED: "Criadas",
  APPROVED: "Aprovadas",
  CANCELED: "Canceladas",
  CANCELED_REQUESTED: "Cancelamento Solicitado",
  EDITED: "Editadas",
  REJECTED: "Rejeitadas",
  PEOPLE_REQUESTED: "Usuários Solicitado",
  PAYMENT_REQUESTED: "Pagamento Solicitado",
  PEOPLE_SENT: "Participantes Enviados",
  PAYMENT_SENT: "Pagamento Enviado",
  DOCUMENT_REQUESTED: "Documento Solicitado",
  DOCUMENT_APPROVED: "Documento Aprovado",
  DOCUMENT_REJECTED: "Documento Rejeitado",
};

const professorColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold">Nome</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold">Status</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-semibold">E-mail</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => <span className="font-semibold">Ações</span>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MdMoreVert size={18} /> Ações
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MdVisibility size={18} /> Visualizar
          </Button>
        </div>
      );
    },
  },
];

const reservationColumns: ColumnDef<TRequestItem>[] = [
  {
    accessorKey: "member.name",
    header: () => <span className="font-semibold">Nome</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "request.type",
    header: () => <span className="font-semibold">Status</span>,
    cell: (info) =>
      statusMap[info.getValue() as RequestStatus] || info.getValue(),
  },
  {
    accessorKey: "member.email",
    header: () => <span className="font-semibold">E-mail</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => <span className="font-semibold">Ações</span>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MdMoreVert size={18} /> Ações
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <MdVisibility size={18} /> Visualizar
          </Button>
        </div>
      );
    },
  },
];

export default function AdminRequests({
  initialData,
  onFilterChange,
}: {
  initialData?: any;
  onFilterChange?: (filters: TRequestAdminFilters) => void;
}) {
  const [tab, setTab] = useState<"professor" | "reservation">("reservation");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedReservationStatus, setSelectedReservationStatus] = useState<
    RequestStatus[]
  >([]);

  const allRequests: Request[] = [];

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleReservationStatusChange = (status: RequestStatus) => {
    const newStatus = selectedReservationStatus.includes(status)
      ? selectedReservationStatus.filter((s) => s !== status)
      : [...selectedReservationStatus, status];

    setSelectedReservationStatus(newStatus);

    onFilterChange?.({
      page: 1,
      limit: initialData?.limit || 10, 
      status: newStatus.length > 0 ? newStatus : undefined,
    });
  };

  const handleTabChange = (newTab: "professor" | "reservation") => {
    setTab(newTab);
    setSelectedStatus([]);
    setSelectedReservationStatus([]);

    if (newTab === "reservation") {
      onFilterChange?.({
        page: 1,
        limit: initialData?.limit || 10, 
        status: undefined,
      });
    }
  };

  const filteredProfessorRequests = allRequests.filter((d) => {
    return (
      professorStatus.includes(d.status) &&
      (selectedStatus.length ? selectedStatus.includes(d.status) : true)
    );
  });

  const reservationRequests = initialData?.data || [];

  const currentPage = initialData?.page || 1;
  const currentLimit = initialData?.limit || 10;

  return (
    <div className="p-6 bg-white rounded-xl shadow flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            tab === "professor"
              ? "bg-contrast-green text-white"
              : "bg-soft-gray text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabChange("professor")}
        >
          <FaUser size={24} /> Solicitações de Professor
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            tab === "reservation"
              ? "bg-contrast-green text-white"
              : "bg-soft-gray text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabChange("reservation")}
        >
          <FaRegCalendarCheck size={24} /> Solicitações de Reserva
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-semibold">Filtros:</span>
        <span className="text-gray-600">Status:</span>
        <div className="flex flex-wrap gap-3">
          {tab === "professor"
            ? professorStatus.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 px-2 py-1 rounded"
                >
                  <Checkbox
                    checked={selectedStatus.includes(status)}
                    onCheckedChange={() => handleStatusChange(status)}
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))
            : reservationStatus.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <Checkbox
                    checked={selectedReservationStatus.includes(status)}
                    onCheckedChange={() =>
                      handleReservationStatusChange(status)
                    }
                  />
                  <span className="text-sm">{statusMap[status]}</span>
                </label>
              ))}
        </div>
      </div>

      <div className="relative overflow-y-auto max-h-[600px]">
        <DataTable
          columns={tab === "professor" ? professorColumns : reservationColumns}
          data={
            tab === "professor"
              ? filteredProfessorRequests
              : reservationRequests
          }
          filters={{ page: currentPage - 1, limit: currentLimit }} 
          setFilter={(key, value) => {
            if (key === "page") {
              const newPage = value + 1;

              if (tab === "reservation") {
                onFilterChange?.({
                  page: newPage,
                  limit: currentLimit, 
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                });
              }
            }

            if (key === "limit") {
              const newLimit = value;

              if (tab === "reservation") {
                onFilterChange?.({
                  page: 1,
                  limit: newLimit,
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                });
              }
            }
          }}
          meta={{
            page: currentPage - 1, 
            limit: currentLimit,  
            total:
              tab === "professor"
                ? filteredProfessorRequests.length
                : initialData?.total || 0,
          }}
        />
      </div>
    </div>
  );
}
