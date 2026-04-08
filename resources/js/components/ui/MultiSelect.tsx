import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Option = { label: string; value: string };

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const toggleSelectAll = () => {
    if (value.length === options.length) {
      onChange([]); // deselect all
    } else {
      onChange(options.map((opt) => opt.value)); // select all
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-auto">
            {/* Select All Option */}
            <CommandItem
              onSelect={toggleSelectAll}
              className="font-semibold border-b border-gray-200"
            >
              <Checkbox
                checked={value.length === options.length}
                onCheckedChange={toggleSelectAll}
                className="mr-2"
              />
              {value.length === options.length ? "Deselect All" : "Select All"}
            </CommandItem>

            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <CommandItem key={option.value} onSelect={() => toggleSelect(option.value)}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(option.value)}
                    className="mr-2"
                  />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}