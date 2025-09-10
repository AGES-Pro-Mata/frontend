import DataTable from "@/components/table";
import type { TUserAdminRequestFilters } from "@/entities/user-admin-filters";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchAdminUsers } from "../../../hooks/use-fetch-admin-users";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { filters, setFilter } = useFilters<TUserAdminRequestFilters>({
    key: "get-admin-users",
    initialFilters: {
      limit: 10,
      page: 0,
      sort: "email",
      dir: "asc",
    },
  });

  const { items, meta } = useFetchAdminUsers({ filters });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <DataTable
        data={items}
        columns={columns}
        filters={filters}
        meta={meta}
        setFilter={setFilter}
      />
    </div>
  );
}
