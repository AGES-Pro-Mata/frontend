import DataTable from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/hooks/filters/filters";
import { Edit, MoreHorizontal } from "lucide-react";
import { MoonLoader } from "react-spinners";
import type { TRequestsAdminFilters } from "@/entities/requests-admin-filter";
import { useFetchAdminRequest } from "@/hooks/requests/use-fetch-request-admin";
import { REQUESTS_LABEL } from "../../../../utils/consts/requests-consts";
import { useNavigate } from "@tanstack/react-router";
import type { TRequestAdminResponse } from "@/entities/request-admin-response";

export default function ReservationRequestsTable() {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilters<TRequestsAdminFilters>({
    key: "get-requests-admin",
    initialFilters: {
      limit: 10,
      page: 0,
    },
  });
  const { items, meta, isLoading } = useFetchAdminRequest({ filters });

  const handleViewReservationClick = (id: string) => {
    void navigate({ to: `/admin/requests/reservation/${id}` });
  };
  const columns = [
    {
      accessorKey: "experiences",
      header: "Reservas",
      enableSorting: false,
      size: 300,
      cell: ({ row }: { row: { original: TRequestAdminResponse } }) => {
        const value = row.original.experiences;

        return Array.isArray(value) ? value.join(", ") : String(value ?? "");
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }: { row: { original: TRequestAdminResponse } }) => {
        const status = row.original.status;

        return REQUESTS_LABEL[status ?? ""];
      },
    },
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: ({ row }: { row: { original: TRequestAdminResponse } }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => void handleViewReservationClick(row.original.id)}
                className="cursor-pointer gap-4"
              >
                {"Visualizar"}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-6 overflow-hidden">
      <div className="flex-1 relative overflow-auto rounded-md border">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center rounded-lg z-10">
            <MoonLoader size={35} color="#22c55e" />
          </div>
        )}
        <DataTable
          data={items}
          columns={columns}
          isLoading={isLoading}
          filters={filters}
          meta={meta}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
}
