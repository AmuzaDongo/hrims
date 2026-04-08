"use client";

import { router } from "@inertiajs/react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  total: number;
  pageSize?: number;
  currentRoute: string;

  filters?: {
    search?: string;
    per_page?: number;
    [key: string]: any;
  };

  searchPlaceholder?: string;

  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  onExport?: (data: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  links,
  total,
  pageSize = 10,
  currentRoute,
  filters = {},
  enableRowSelection = true,
  enableColumnVisibility = true,
  onExport,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExport = React.useCallback(() => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : data;

    if (onExport) {
      onExport(dataToExport);
    } else {
      const headers = table
        .getVisibleFlatColumns()
        .filter((col) => col.id !== "select" && col.id !== "actions")
        .map((col) => col.id);

      const csv = [
        headers.join(","),
        ...dataToExport.map((row) =>
          headers
            .map((header) => {
              const value = (row as Record<string, unknown>)[header];
              return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      window.URL.revokeObjectURL(url);
    }
  }, [table, onExport, data]);

  return (
    <div className="space-y-4">
      {/* 🔍 Toolbar */}
      <DataTableToolbar
        filters={filters}
        searchPlaceholder="Search..."
        enableExport
        onExport={handleExport}
        enableColumnVisibility={enableColumnVisibility}
        table={table}
      />

      {/* 📊 Table */}
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔥 Pagination */}
      <DataTablePagination
        links={links}
        total={total}
        pageSize={filters.per_page || pageSize}
        onPageSizeChange={(size) =>
          router.get(currentRoute, { ...filters, per_page: size }, { preserveState: true })
        }
      />
    </div>
  );
}