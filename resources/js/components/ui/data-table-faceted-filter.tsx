"use client";

import { router } from "@inertiajs/react";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableFacetedFilterProps {
  title?: string;
  param: string; // 🔥 query param (e.g. "status")
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  value?: string[]; // 🔥 current selected values from backend
}

export function DataTableFacetedFilter({
  title,
  param,
  options,
  value = [],
}: DataTableFacetedFilterProps) {
  const selectedValues = new Set(value);

  const updateFilter = (newValues: string[]) => {
    router.get(
      window.location.pathname,
      {
        ...Object.fromEntries(new URLSearchParams(window.location.search)),
        [param]: newValues.length ? newValues : undefined,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}

          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary">
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newValues = new Set(selectedValues);

                      if (isSelected) {
                        newValues.delete(option.value);
                      } else {
                        newValues.add(option.value);
                      }

                      updateFilter(Array.from(newValues));
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center border rounded",
                        isSelected
                          ? "bg-primary text-white"
                          : "opacity-50"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>

                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => updateFilter([])}
                    className="justify-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}