"use client";

import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface DataTablePaginationProps {
  links: PaginationLink[];
  total: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export function DataTablePagination({
  links,
  total,
  pageSize,
  pageSizeOptions = [2, 5, 10, 20, 50],
  onPageSizeChange,
}: DataTablePaginationProps) {
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);

  useEffect(() => {
    // Update local state if parent changes pageSize
    setSelectedPageSize(pageSize);
  }, [pageSize]);

  const handlePageSizeChange = (value: number) => {
    setSelectedPageSize(value);
    onPageSizeChange?.(value);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-2 pt-4">
      {/* Total Rows & Page Size */}
      <div className="flex items-center gap-4 text-sm">
        <span>Total: {total} row{total !== 1 ? "s" : ""}</span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={`${selectedPageSize}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Links */}
      <div className="flex items-center gap-1 flex-wrap">
        {links.map((link, i) => (
          <Button
            key={i}
            variant={link.active ? "default" : "outline"}
            size="sm"
            disabled={!link.url}
            onClick={() =>
              link.url &&
              router.get(link.url, {}, { preserveState: true, replace: true })
            }
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
  );
}