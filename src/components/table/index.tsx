import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type TableState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { TApiDefaultFilters } from "@/entities/api-default-filters";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: { total: number };
  pageSizeOptions?: number[];
  filters: TApiDefaultFilters;
  setFilter: <K extends keyof TApiDefaultFilters>(
    key: K,
    value: TApiDefaultFilters[K]
  ) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  meta = { total: 11 },
  pageSizeOptions = [10, 25, 50],
  setFilter,
  filters: { dir, sort, limit, page },
}: DataTableProps<TData, TValue>) {
  const handleSortColumn = (columnId: string) => {
    if (sort === columnId) {
      if (dir === "asc") setFilter("dir", "desc");
      else if (dir === "desc") {
        setFilter("sort", undefined);
        setFilter("dir", undefined);
      }
    } else {
      setFilter("sort", columnId);
      setFilter("dir", "asc");
    }
  };

  const tableState: Partial<TableState> = React.useMemo(
    () => ({
      pagination: { pageIndex: page, pageSize: limit },
      sorting: sort ? [{ id: sort, desc: dir === "desc" }] : [],
    }),
    [page, limit, sort, dir]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: tableState,
  });

  return (
    <div className="h-full w-full flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white">
      <Table className="w-full table-fixed">
        <TableHeader className="bg-white sticky top-0 z-20 shadow-[0_1px_0_0_theme(colors.slate.300)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                return (
                  <TableHead key={header.id}>
                    <div
                      className={cn("flex items-center gap-1 select-none", {
                        "cursor-pointer": canSort,
                      })}
                      onClick={() => handleSortColumn(header.column.id)}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && sort === header.column.id && (
                        <>
                          {dir === "desc" && <IoIosArrowDown />}
                          {dir === "asc" && <IoIosArrowUp />}
                        </>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
      </Table>
      <div className="flex-1 overflow-auto">
        <Table className="w-full table-fixed">
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="h-16"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2 p-3 bg-white border-t border-slate-300">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Resultados por página:</span>
          <select
            className="border rounded px-2 py-1"
            value={limit}
            onChange={(e) => {
              setFilter("limit", Number(e.target.value));
              setFilter("page", 0);
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className={cn("shadow-none", {
              "cursor-pointer": page !== 0,
            })}
            disabled={page === 0}
            onClick={() => setFilter("page", Math.max(0, page - 1))}
          >
            <IoIosArrowBack
              className={cn("size-5", {
                "opacity-50": page === 0,
              })}
            />
          </Button>

          <div className="py-1 select-none">
            {`Página ${page + 1} de ${Math.ceil(
              Number(meta?.total) / Number(limit)
            )}`}
          </div>

          <Button
            size="icon"
            className={cn("shadow-none", {
              "cursor-pointer":
                page !==
                Number(Math.ceil(Number(meta?.total) / Number(limit))) - 1,
            })}
            disabled={
              page ===
              Number(Math.ceil(Number(meta?.total) / Number(limit))) - 1
            }
            onClick={() => setFilter("page", page + 1)}
          >
            <IoIosArrowForward
              className={cn("size-5", {
                "opacity-50":
                  page ===
                  Number(Math.ceil(Number(meta?.total) / Number(limit))) - 1,
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
