import { useState, useRef, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/index";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegCalendarCheck, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import type { TRequestListItem } from "@/entities/request-admin-response";
import type {
  TRequestAdminFilters,
  TRequestAdminTeacherFilters,
} from "@/entities/request-admin-filters";
import { useNavigate } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";

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
type RequestTeacherStatus = NonNullable<
  TRequestAdminTeacherFilters["status"]
>[number];

const professorStatus: RequestTeacherStatus[] = [
  "APPROVED",
  "REJECTED",
  "CREATED",
  // Adicione outros status válidos do tipo RequestTeacherStatus se existirem
];

const statusTeacherMap: Record<RequestTeacherStatus, string> = {
  APPROVED: "Aprovadas",
  REJECTED: "Rejeitadas",
  CREATED: "Pendentes",
};

const requestStatus: RequestStatus[] = [
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
  const [tab, setTab] = useState<"professor" | "request">("request");
  const [selectedStatus, setSelectedStatus] = useState<RequestTeacherStatus[]>(
    []
  );
  const [selectedRequestStatus, setSelectedRequestStatus] = useState<
    RequestStatus[]
  >([]);

  const pendingLimitRef = useRef<number | null>(null);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined);

  const allRequests: TRequestListItem[] = initialData?.data || [];
  
  const filteredProfessorRequests = allRequests.filter((d) => {
    return (
      professorStatus.includes(d.request.type as RequestTeacherStatus) &&
      (selectedStatus.length
        ? selectedStatus.includes(d.request.type as RequestTeacherStatus)
        : true)
    );
  });

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (currentPath.includes("/teacher")) {
      setTab("professor");
      setSelectedStatus([]);
    } else {
      setTab("request");
      setSelectedRequestStatus([]);
    }
  }, [currentPath]);

  const professorColumns: ColumnDef<TRequestListItem>[] = [
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
        statusTeacherMap[info.getValue() as RequestTeacherStatus] ||
        info.getValue(),
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
                  window.location.href = `/admin/requests/${id}`;
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

  const requestColumns: ColumnDef<TRequestListItem>[] = [
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

  const handleStatusChange = (status: RequestTeacherStatus) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleRequestStatusChange = (status: RequestStatus) => {
    const newStatus = selectedRequestStatus.includes(status)
      ? selectedRequestStatus.filter((s) => s !== status)
      : [...selectedRequestStatus, status];

    setSelectedRequestStatus(newStatus);

    const currentLimit = pendingLimitRef.current ?? initialData?.limit ?? 10;

    onFilterChange?.({
      page: 1,
      limit: currentLimit,
      status: newStatus.length > 0 ? newStatus : undefined,
      sort: sortField,
      dir: sortDir,
    });
  };

  const requestRequests = initialData?.data || [];

  const currentPage = initialData?.page || 1;
  const currentLimit = pendingLimitRef.current ?? initialData?.limit ?? 10;

  const navigate = useNavigate();

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            tab === "professor"
              ? "bg-contrast-green text-white"
              : "bg-soft-gray text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => {
            setTab("professor");
            setSelectedStatus([]);
            navigate({ to: "/admin/requests/teacher" });
          }}
        >
          <FaUser size={24} /> Solicitações de Professor
        </Button>
        <Button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            tab === "request"
              ? "bg-contrast-green text-white"
              : "bg-soft-gray text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => {
            setTab("request");
            setSelectedRequestStatus([]);
            navigate({ to: "/admin/requests" });
          }}
        >
          <FaRegCalendarCheck size={24} /> Solicitações de Reserva
        </Button>
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
                  <span className="text-sm">
                    {statusTeacherMap[status as RequestTeacherStatus] ?? status}
                  </span>
                </label>
              ))
            : requestStatus.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <Checkbox
                    checked={selectedRequestStatus.includes(status)}
                    onCheckedChange={() => handleRequestStatusChange(status)}
                  />
                  <span className="text-sm">{statusMap[status]}</span>
                </label>
              ))}
        </div>
      </div>

      <div className="relative overflow-y-auto max-h-[600px]">
        <DataTable
          columns={tab === "professor" ? professorColumns : requestColumns}
          data={tab === "professor" ? filteredProfessorRequests : requestRequests}
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

              if (tab === "request") {
                onFilterChange?.({
                  page: newPage,
                  limit: activeLimit,
                  status:
                    selectedRequestStatus.length > 0
                      ? selectedRequestStatus
                      : undefined,
                  sort: sortField,
                  dir: sortDir,
                });
              }
            }

            if (key === "limit") {
              const newLimit = value as number;

              pendingLimitRef.current = newLimit;

              if (tab === "request") {
                onFilterChange?.({
                  page: 1,
                  limit: newLimit,
                  status:
                    selectedRequestStatus.length > 0
                      ? selectedRequestStatus
                      : undefined,
                  sort: sortField,
                  dir: sortDir,
                });
              }
            }

            if (key === "sort") {
              const newSort = value as string | undefined;
              setSortField(newSort);

              if (tab === "request") {
                onFilterChange?.({
                  page: 1,
                  limit: currentLimit,
                  status:
                    selectedRequestStatus.length > 0
                      ? selectedRequestStatus
                      : undefined,
                  sort: newSort,
                  dir: sortDir,
                });
              }
            }

            if (key === "dir") {
              const newDir = value as "asc" | "desc" | undefined;
              setSortDir(newDir);

              if (tab === "request") {
                onFilterChange?.({
                  page: 1,
                  limit: currentLimit,
                  status:
                    selectedRequestStatus.length > 0
                      ? selectedRequestStatus
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
