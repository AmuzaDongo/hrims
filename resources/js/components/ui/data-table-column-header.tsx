"use client";

import { router } from "@inertiajs/react";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  sortKey: string;
  currentSort?: string;
  direction?: "asc" | "desc";
}

export function DataTableColumnHeader({
  title,
  sortKey,
  currentSort,
  direction,
}: Props) {
  const isActive = currentSort === sortKey;

  const toggleSort = () => {
    const newDirection =
      isActive && direction === "asc" ? "desc" : "asc";

    router.get(
      window.location.pathname,
      {
        sort: sortKey,
        direction: newDirection,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleSort}>
      {title}
      {isActive ? (
        direction === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        )
      ) : null}
    </Button>
  );
}