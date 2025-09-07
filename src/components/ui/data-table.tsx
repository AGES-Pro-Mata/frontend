import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type Row,
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SearchX, Search } from "lucide-react"
import type { ReactNode } from "react"

// Small classnames util
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export type DataTableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  /** Optional custom row id getter (defaults to array index) */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  /** Called whenever the selection changes (selected rows only on the current page by default) */
  onSelectionChange?: (rows: Row<TData>[]) => void
  /** Optional global filter input (client-side). Pass placeholder to show it. */
  globalFilterPlaceholder?: string
  /** Render custom actions on the right-most column */
  renderActions?: (row: Row<TData>) => React.ReactNode
  /** Initial page size (default 10) */
  initialPageSize?: number
  /** Enable selection */
  enableSelection?: boolean
  trailingHeader?: ReactNode

  globalFilter: string,
  setGlobalFilter: (filter: string) => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  getRowId,
  onSelectionChange,
  renderActions,
  globalFilterPlaceholder,
  initialPageSize = 10,
  enableSelection,
  trailingHeader,
  globalFilter,
  setGlobalFilter
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: initialPageSize })

  // Selection column (left)
  const selectionColumn = React.useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "_select",
      enableSorting: false,
      enableHiding: false,
      size: 44,
      header: ({ table }) => (
        <div className="pl-2">
          <Checkbox
            aria-label="Select all"
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="pl-2">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),
    []
  )

  // Actions column (right)
  const actionsColumn = React.useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "_actions",
      enableSorting: false,
      enableHiding: false,
      size: 120,
      header: () => <div className="text-right pr-2">Ações</div>,
      cell: ({ row }) => (
        <div className="text-right pr-2">
          {renderActions ? (
            renderActions(row)
          ) : (
            <></>
          )}
        </div>
      ),
    }),
    [renderActions]
  )

  const computedColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (enableSelection) {
      return [selectionColumn, ...columns, actionsColumn]
    }
    return [...columns, actionsColumn]
  }, [selectionColumn, columns, actionsColumn])

  const table = useReactTable({
    data,
    columns: computedColumns,
    state: { rowSelection, globalFilter, pagination },
    onRowSelectionChange: (updater) => {
      setRowSelection(updater as any)
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    enableRowSelection: enableSelection,
    // Keep row selection when data changes
    // (optional) getRowCanExpand, getExpandedRowModel if you want tree tables
  })

  React.useEffect(() => {
    if (!onSelectionChange) return
    const selected = table.getSelectedRowModel().rows
    onSelectionChange(selected)
  }, [rowSelection]) // eslint-disable-line react-hooks/exhaustive-deps

  const total = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.getState().pagination
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <div className="space-y-3">
      {globalFilterPlaceholder && (
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2">
            <Input
              placeholder={globalFilterPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm min-w-sm"
            />
            <Button variant="outline"><Search /></Button>
          </div>

          {trailingHeader ?? <></>}
        </div>
      )}

      <div className="rounded-2xl border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={cn(header.id === "_actions" && "text-right")}
                    style={{ width: header.getSize() ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(cell.column.id === "_actions" && "text-right")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={computedColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {total === 0 ? "0" : `${from}`}
          {total > 0 && `–${to}`} de {total}
          {Object.keys(rowSelection).length > 0 && (
            <span> · {Object.keys(rowSelection).length} Selecionado</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent align="end">
              {[5, 10, 20, 30, 50, 100].map((s) => (
                <SelectItem key={s} value={String(s)}>{s} / página</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm tabular-nums text-muted-foreground">
            Página {pageIndex + 1} de {Math.max(1, table.getPageCount())}
          </div>
        </div>
      </div>
    </div>
  )
}
