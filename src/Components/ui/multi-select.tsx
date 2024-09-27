"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  Check,
  ChevronsUpDown,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

import { Badge } from "./badge";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/ui/utils";

interface Framework {
  value: string;
  label: string;
}

type SelectItem = {
  title?: string;
  value: string | number;
};

type Props = {
  name: string;
  options: SelectItem[];
  defaultValues?: SelectItem[];
  onValueChange?: (value: SelectItem[]) => void;

  open?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  contentHintText?: string;
  inputPlaceholder?: string;
};

export default function MultipleSelectBox(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<SelectItem[]>([]);

  React.useEffect(() => {
    setSelectedItems(props.defaultValues || []);
  }, [props.defaultValues]);

  const handleSelect = (item: SelectItem) => {
    setSelectedItems((current) => {
      const isSelected = current.some(
        (selected) => selected.value === item.value
      );
      if (isSelected) {
        const values = current.filter(
          (selected) => selected.value !== item.value
        );
        props.onValueChange?.(values);
        return values;
      } else {
        const values = [...current, item];
        props.onValueChange?.(values);
        return values;
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          className={cn(
            "w-full cursor-pointer gap-2 relative pr-7 border rounded-md flex-wrap p-2 pl-2 flex items-center",
            open && "bg-transparent"
          )}
        >
          {selectedItems && selectedItems.length > 0 ? (
            <>
              {selectedItems.map((item) => (
                <div
                  key={item.value}
                  className="p-0.5 px-1.5 border hover:border-primary group transition-all border-secondary rounded-xl inline-flex items-center"
                >
                  <span className="text-xs inline-block mr-1 group-hover:border-primary border-r border-secondary pr-2">
                    {item.title}
                  </span>
                  <button className="hover:text-destructive text-lg opacity-75 hover:opacity-100 transition-all">
                    &times;
                  </button>
                </div>
              ))}
            </>
          ) : (
            props.placeholder || "Select options"
          )}
          <button
            type="button"
            className="absolute right-0 w-7 justify-center h-full items-center"
          >
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 relative overflow-clip">
        <Command className="rounded-lg border shadow-md w-max max-w-[630px]">
          <CommandInput
            placeholder={
              props.inputPlaceholder || "Type a command or search..."
            }
          />
          <CommandList className="w-full">
            <CommandEmpty className="p-6 text-center w-full">
              No results found.
            </CommandEmpty>
            <CommandGroup heading={props.contentHintText || "Suggestions"}>
              <div className="pr-2 sm:pr-4 divide-y">
                {props.options.map((option) => {
                  const isSelected = selectedItems.some(
                    (item) => item.value === option.value
                  );
                  return (
                    <CommandItem
                      key={option.value || option.title}
                      className={cn(
                        "flex-grow cursor-pointer",
                        isSelected
                          ? "opacity-100 bg-secondary text-secondary-foreground"
                          : "opacity-90"
                      )}
                      value={option.value.toString() || option.title}
                      onSelect={() => handleSelect(option)}
                    >
                      <span className="w-6 mr-2 inline-block">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected
                              ? "opacity-100 text-primary"
                              : "opacity-50"
                          )}
                        />
                      </span>
                      {option.title || option.value}
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
