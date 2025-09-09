import DataTable from "@/components/table";
import type { TUserAdminRequestFilters } from "@/entities/user-admin-filters";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute } from "@tanstack/react-router";
import type { CellContext } from "@tanstack/react-table";
import { useFetchAdminUsers } from "../../../hooks/use-fetch-admin-users";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

type User = {
  id: number;
  name: string;
  email: string;
};

function RouteComponent() {
  const { filters, setFilter } = useFilters<TUserAdminRequestFilters>({
    key: "get-admin-users",
    initialFilters: {
      limit: 10,
      page: 1,
      sort: "email",
      dir: "asc",
    },
  });

  const { items } = useFetchAdminUsers({ filters });
  console.log(items)
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
      cell: (info: CellContext<User, number>) => (
        <span className="text-red-500">{info.getValue()}</span>
      ),
    },
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
        setFilter={setFilter}
      />
    </div>
  );
}
