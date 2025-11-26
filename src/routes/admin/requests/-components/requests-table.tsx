import DataTable from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/hooks/filters/filters";
import { Edit, FilterXIcon, MoreHorizontal } from "lucide-react";
import { MoonLoader } from "react-spinners";
import type { TRequestsAdminFilters } from "@/entities/requests-admin-filter";
import { useFetchAdminRequest } from "@/hooks/requests/use-fetch-request-admin";
import { REQUESTS_LABEL } from "../../../../utils/consts/requests-consts";
import { useNavigate } from "@tanstack/react-router";
import type { TRequestAdminResponse } from "@/entities/request-admin-response";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { type ChangeEvent, useState } from "react";
import { useDebounce } from "@/hooks";
import { RequestsType } from "@/utils/enums/requests-enum";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const PLACE_HOLDER_TRANSLATE_TEXT = {
  experiences: "requests.admin.filters.experiences",
  email: "requests.admin.filters.email",
} as const;

type FilterKey = keyof typeof PLACE_HOLDER_TRANSLATE_TEXT;

export default function ReservationRequestsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("experiences");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    filters,
    setFilter,
    reset: resetFilters,
  } = useFilters<TRequestsAdminFilters>({
    key: "get-requests-admin",
    initialFilters: {
      limit: 10,
      page: 0,
      status: [],
    },
  });
  const { items, meta, isLoading } = useFetchAdminRequest({ filters });

  const handleViewReservationClick = (id: string) => {
    navigate({ to: `/admin/requests/reservation/${id}` });
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
  };

  React.useEffect(() => {
    if (filters[selectedFilter] !== debouncedSearchTerm) {
      setFilter(selectedFilter, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, selectedFilter, setFilter, filters]);

  const onChangeFilter = (value: FilterKey) => {
    if (!value) return;
    setFilter(selectedFilter, undefined);
    setSelectedFilter(value);
  };

  const searchInputPlaceholder = t("requests.admin.filters.searchPlaceholder", {
    field: t(PLACE_HOLDER_TRANSLATE_TEXT[selectedFilter]),
  });

  const columns = [
    {
      accessorKey: "experiences",
      header: t("reserve"),
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
      header: t("requests.admin.statusLabel"),
      enableSorting: true,
      cell: ({ row }: { row: { original: TRequestAdminResponse } }) => {
        const status = row.original.status;

        return t(REQUESTS_LABEL[status ?? ""]);
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
                onClick={() => handleViewReservationClick(row.original.id)}
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

  const selectOptions = Object.values(RequestsType).map((request) => {
    return { label: t(REQUESTS_LABEL[request]), value: request };
  });

  const handleChangeStatusFilter = (status: string[]) => {
    setFilter("status", status as RequestsType[]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedFilter("experiences");
    resetFilters();
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 overflow-hidden">
      <div className="flex w-full justify-between gap-4">
        <div className="w-full flex gap-4 items-center lex-shrink-0">
          <Input
            value={searchTerm}
            className="w-1/3 h-12"
            placeholder={searchInputPlaceholder}
            onChange={onChangeSearch}
          />
          <ToggleGroup
            type="single"
            value={selectedFilter}
            onValueChange={onChangeFilter}
            className="gap-2 w-1/2"
          >
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="experiences"
            >
              {t("requests.admin.filters.experiences")}
            </ToggleGroupItem>
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="email"
            >
              Email
            </ToggleGroupItem>
          </ToggleGroup>
          <MultiSelect
            onChange={handleChangeStatusFilter}
            value={(filters.status as string[]) ?? []}
            options={selectOptions}
            placeholder="Selecionar Status..."
          />
        </div>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-12 h-12 rounded-full bg-red-500"
        >
          <FilterXIcon className="size-6 text-white" />
        </Button>
      </div>
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
