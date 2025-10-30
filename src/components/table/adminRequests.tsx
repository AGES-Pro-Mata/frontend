import { useState, useRef } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/index";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegCalendarCheck, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import type { TRequestItem } from "@/entities/request-admin-response";
import type { TRequestAdminFilters } from "@/entities/request-admin-filters";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react"; 

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
  REJECTED: "Rejeitadas",
  PEOPLE_REQUESTED: "Usuários Solicitado",
  PAYMENT_REQUESTED: "Pagamento Solicitado",
  PEOPLE_SENT: "Participantes Enviados",
  PAYMENT_SENT: "Pagamento Enviado",
  DOCUMENT_REQUESTED: "Documento Solicitado",
  DOCUMENT_APPROVED: "Documento Aprovado",
  DOCUMENT_REJECTED: "Documento Rejeitado",
};

export default function AdminRequests({
  initialData,
  onFilterChange,
}: {
  initialData?: any;
  onFilterChange?: (filters: TRequestAdminFilters) => void;
}) {
  const [tab, setTab] = useState<"professor" | "reservation">("reservation");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState<RequestStatus[]>([]);

 

  const pendingLimitRef = useRef<number | null>(null);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const allRequests: Request[] = [];

  const professorColumns: ColumnDef<Request>[] = [
    {
      accessorKey: "name",
      header: () => <span className="font-semibold">Nome</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: () => <span className="font-semibold">Status</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: () => <span className="font-semibold">E-mail</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/admin/requests/reservation-info/${id}`;
                }}
                className="cursor-pointer gap-2"
              >
                <Eye className="size-4" />
                Visualizar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const reservationColumns: ColumnDef<TRequestItem>[] = [
    {
      accessorKey: "member.name",
      header: () => <span className="font-semibold">Nome</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "request.type",
      header: () => <span className="font-semibold">Status</span>,
      cell: (info) =>
        statusMap[info.getValue() as RequestStatus] || info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "member.email",
      header: () => <span className="font-semibold">E-mail</span>,
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <span className="font-semibold">Ações</span>,
      cell: ({ row }) => {
        const requestId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/admin/requests/${requestId}`;
                }}
                className="cursor-pointer gap-2"
              >
                <Eye className="size-4" />
                Visualizar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

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

    const currentLimit = pendingLimitRef.current ?? initialData?.limit ?? 10;

    onFilterChange?.({
      page: 1,
      limit: currentLimit,
      status: newStatus.length > 0 ? newStatus : undefined,
      sort: sortField,
      dir: sortDir,
    });
  };

  const handleTabChange = (newTab: "professor" | "reservation") => {
    setTab(newTab);
    setSelectedStatus([]);
    setSelectedReservationStatus([]);
    pendingLimitRef.current = null;
    setSortField(undefined);
    setSortDir(undefined);

    if (newTab === "reservation") {
      onFilterChange?.({
        page: 1,
        limit: initialData?.limit || 10,
        status: undefined,
        sort: undefined,
        dir: undefined,
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
  const currentLimit = pendingLimitRef.current ?? initialData?.limit ?? 10;

  return (
    <>
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
          columns={
            (tab === "professor" ? professorColumns : reservationColumns) as ColumnDef<any>[]
          }
          data={tab === "professor" ? filteredProfessorRequests : reservationRequests}
          filters={{
            page: currentPage - 1,
            limit: currentLimit,
            sort: sortField,
            dir: sortDir,
          }}
          setFilter={(key, value) => {
            if (key === "page") {
              const newPage = value + 1;
              const activeLimit = pendingLimitRef.current ?? currentLimit;

              if (tab === "reservation") {
                onFilterChange?.({
                  page: newPage,
                  limit: activeLimit,
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                  sort: sortField,
                  dir: sortDir,
                });
              }
            }

            if (key === "limit") {
              const newLimit = value as number; 

              pendingLimitRef.current = newLimit;

              if (tab === "reservation") {
                onFilterChange?.({
                  page: 1,
                  limit: newLimit,
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                  sort: sortField,
                  dir: sortDir,
                });
              }
            }

            if (key === "sort") {
              const newSort = value as string | undefined; 
              setSortField(newSort);

              if (tab === "reservation") {
                onFilterChange?.({
                  page: 1,
                  limit: currentLimit,
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                  sort: newSort,
                  dir: sortDir,
                });
              }
            }

            if (key === "dir") {
              const newDir = value as "asc" | "desc" | undefined; 
              setSortDir(newDir);

              if (tab === "reservation") {
                onFilterChange?.({
                  page: 1,
                  limit: currentLimit,
                  status:
                    selectedReservationStatus.length > 0
                      ? selectedReservationStatus
                      : undefined,
                  sort: sortField,
                  dir: newDir,
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
    </>
  );
}