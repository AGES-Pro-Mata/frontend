import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/index";
import { Checkbox } from "@/components/ui/checkbox";
import { FaUser, FaRegCalendarCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { MdMoreVert, MdVisibility } from "react-icons/md";
import { useCallback } from "react";
import { useAdminRequests } from "@/hooks/useAdminRequests";

type Request = {
  id: string;
  name: string;
  email: string;
  status: string;
};

const professorStatus = ["Approved", "Rejected", "Pending"];
const reservationStatus = [
  "Confirmed",
  "Pending",
  "User Requested",
  "Payment Requested",
  "Cancellation Requested",
  "Edit Requested",
];

const professorColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold">Name</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold">Status</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-semibold">Email</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row }) => {
      const request: Request = row.original;
      return (
        <div className="flex flex-col gap-1">
          <ApproveButton requestId={request.id} />
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MdVisibility size={18} /> View
          </Button>
        </div>
      );
    },
  },
];

function ApproveButton({ requestId }: { requestId: string }) {
  // Usa apenas a mutation, sem filtros
  const { approveMutation } = useAdminRequests({});

  const handleApprove = useCallback(() => {
    approveMutation.mutate(requestId);
  }, [approveMutation, requestId]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleApprove}
      disabled={approveMutation.isPending}
    >
      {approveMutation.isPending ? (
        <span className="animate-spin mr-2">⏳</span>
      ) : (
        <MdMoreVert size={18} />
      )}
      Approve
    </Button>
  );
}

const reservationColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold">Name</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold">Status</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-semibold">Email</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row }) => {
      const request: Request = row.original;
      return (
        <div className="flex flex-col gap-1">
          <ApproveButton requestId={request.id} />
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MdVisibility size={18} /> View
          </Button>
        </div>
      );
    },
  },
];

export default function AdminRequests() {
  const [tab, setTab] = useState<"professor" | "reservation">("professor");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined as string | undefined,
    sort: undefined as string | undefined,
    dir: undefined as "asc" | "desc" | undefined,
  });

  // Passa filtros para o hook
  const { requestsQuery } = useAdminRequests({
    page: filters.page,
    limit: filters.limit,
    status: selectedStatus.length ? selectedStatus[0] : undefined,
  });

  const loading = requestsQuery.isLoading;
  const error = requestsQuery.error;
  // Garante que sempre seja array, mesmo que a API retorne objeto
  const allRequests: Request[] = Array.isArray(requestsQuery.data)
    ? requestsQuery.data
    : requestsQuery.data?.data || requestsQuery.data?.results || [];

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filtra por status e tab
  const filteredRequests = allRequests.filter((d) => {
    if (tab === "professor") {
      return professorStatus.includes(d.status) &&
        (selectedStatus.length ? selectedStatus.includes(d.status) : true);
    } else {
      return reservationStatus.includes(d.status) &&
        (selectedStatus.length ? selectedStatus.includes(d.status) : true);
    }
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">Error loading requests.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow flex flex-col gap-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "professor"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setTab("professor");
            setSelectedStatus([]);
          }}
        >
          <FaUser size={24} /> Professor Requests
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            tab === "reservation"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setTab("reservation");
            setSelectedStatus([]);
          }}
        >
          <FaRegCalendarCheck size={24} /> Reservation Requests
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="font-semibold">Filters:</span>
        <span>Status:</span>
        {(tab === "professor" ? professorStatus : reservationStatus).map((status) => (
          <label key={status} className="flex items-center gap-1">
            <Checkbox
              checked={selectedStatus.includes(status)}
              onCheckedChange={() => handleStatusChange(status)}
            />
            {status}
          </label>
        ))}
      </div>

      <DataTable
        columns={tab === "professor" ? professorColumns : reservationColumns}
        data={filteredRequests}
        filters={filters}
        setFilter={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        meta={{ 
          page: filters.page, 
          limit: filters.limit, 
          total: filteredRequests.length 
        }}
      />
    </div>
  );
}