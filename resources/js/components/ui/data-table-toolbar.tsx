"use client";

import { router } from "@inertiajs/react";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  filters?: { search?: string; [key: string]: any };
  searchPlaceholder?: string;
  enableExport?: boolean;
  onExport?: () => void;
  enableColumnVisibility?: boolean;
  table?: any; // pass the react-table instance
}

export function DataTableToolbar({
  filters = {},
  searchPlaceholder = "Search...",
  enableExport = true,
  onExport,
  enableColumnVisibility = true,
  table,
}: DataTableToolbarProps) {
  const [search, setSearch] = useState(filters.search || "");

  // 🔥 Debounced search for server-side filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.get(
        window.location.pathname,
        {
          ...filters,
          search,
        },
        {
          preserveState: true,
          replace: true,
        }
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      {/* Search Input */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        className="h-9 w-64.5"
      />

      {/* Right-side buttons */}
      <div className="flex items-center gap-2">
        {/* Export Button */}
        {enableExport && onExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}

        {/* Column visibility toggle */}
        {enableColumnVisibility && table && (
          <DataTableViewOptions table={table} />
        )}
      </div>
    </div>
  );
}