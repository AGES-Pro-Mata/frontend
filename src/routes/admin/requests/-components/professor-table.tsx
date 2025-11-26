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
import { PROFESSOR_REQUESTS_LABEL } from "../../../../utils/consts/requests-consts";
import { useNavigate } from "@tanstack/react-router";
import type { TProfessorRequestsAdminFilters } from "@/entities/professor-requests-admin-filter";
import { useFetchProfessorAdminRequest } from "@/hooks/requests/use-fetch-professor-request-admin";
import type { TProfessorRequestAdminResponse } from "@/entities/professor-request-admin-response";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { ProfessorRequestsType } from "@/utils/enums/requests-enum";
import React, { type ChangeEvent, useState } from "react";
import { useDebounce } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const PLACE_HOLDER_TRANSLATE_TEXT = {
  name: "requests.admin.filters.name",
  email: "requests.admin.filters.email",
} as const;

type FilterKey = keyof typeof PLACE_HOLDER_TRANSLATE_TEXT;

export default function ProfessorRequestsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    filters,
    setFilter,
    reset: resetFilters,
  } = useFilters<TProfessorRequestsAdminFilters>({
    key: "get-professor-requests-admin",
    initialFilters: {
      limit: 10,
      page: 0,
      status: [],
    },
  });
  const { items, meta, isLoading } = useFetchProfessorAdminRequest({ filters });

  const handleViewProfessorRequestClick = (id: string) => {
    void navigate({ to: `/admin/requests/professor/${id}` });
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
      accessorKey: "name",
      header: t("requests.admin.filters.name"),
    },
    {
      accessorKey: "email",
      header: t("requests.admin.filters.email"),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: t("requests.admin.statusLabel"),
      enableSorting: true,
      cell: ({ row }: { row: { original: TProfessorRequestAdminResponse } }) => {
        const status = row.original.status;

        return t(PROFESSOR_REQUESTS_LABEL[status ?? ""]);
      },
    },
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: ({ row }: { row: { original: TProfessorRequestAdminResponse } }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => void handleViewProfessorRequestClick(row.original.id)}
                className="cursor-pointer gap-4"
              >
                {t("requests.admin.actions.view")}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const selectOptions = Object.values(ProfessorRequestsType).map((request) => {
    return { label: t(PROFESSOR_REQUESTS_LABEL[request]), value: request };
  });

  const handleChangeStatusFilter = (status: string[]) => {
    setFilter("status", status as ProfessorRequestsType[]);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedFilter("name");
    resetFilters();
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 overflow-hidden">
      <div className="flex w-full justify-between">
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
              value="name"
            >
              Nome
            </ToggleGroupItem>
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="email"
            >
              Email
            </ToggleGroupItem>
            <MultiSelect
              onChange={handleChangeStatusFilter}
              value={(filters.status as string[]) ?? []}
              options={selectOptions}
            />
          </ToggleGroup>
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
