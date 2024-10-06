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
  label?: string;
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
  contentClassName?: string;
  inputPlaceholder?: string;
};

export default function MultipleSelectBox(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<SelectItem[]>([]);
  const [options, setOptions] = React.useState(props.options);

  const removeSelectedOptionsFromList = React.useCallback(
    (selectedOptions: SelectItem[], options: SelectItem[]) => {
      return options.filter(
        (option) =>
          !selectedOptions.some(
            (selectedOption) => selectedOption.value === option.value
          )
      );
    },
    []
  );

  React.useEffect(() => {
    setSelectedItems(props.defaultValues || []);
    setOptions(
      removeSelectedOptionsFromList(props.defaultValues || [], props.options)
    );
  }, [props.defaultValues, props.options, removeSelectedOptionsFromList]);

  const handleSelect = (item: SelectItem) => {
    setSelectedItems((current) => {
      const isSelected = current.some(
        (selected) => selected.value === item.value
      );
      if (isSelected) {
        const values = current.filter(
          (selected) => selected.value !== item.value
        );
        setOptions(removeSelectedOptionsFromList(values, props.options));
        props.onValueChange?.(values);
        return values;
      } else {
        const values = [...current, item];
        props.onValueChange?.(values);
        setOptions(removeSelectedOptionsFromList(values, props.options));
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
            "relative cursor-pointer min-h-10 flex gap-1.5 w-full rounded-md border border-input bg-background flex-wrap p-2 items-center pl-2 pr-7 text-sm ring-offset-background font-medium",
            open && "ring-2 outline-none ring-ring ring-offset-2",
            props.disabled && "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {selectedItems && selectedItems.length > 0 ? (
            <>
              {selectedItems.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    "p-0.5 px-1.5 border bg-secondary/50 text-secondary-foreground/80 border-secondary/90 group transition-all rounded-xl inline-flex items-center",
                    !open &&
                      "bg-secondary/70 border-secondary/80 text-secondary-foreground/90 group-hover:text-secondary-foreground hover:bg-secondary/90 hover:border-secondary"
                  )}
                >
                  <span className="text-xs inline-block text-foreground/70 group-hover:text-foreground/90 mr-1 group-hover:border-secondary border-r border-secondary/80 pr-2">
                    {item.label || item.title}
                  </span>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      ev.preventDefault();
                      handleSelect(item);
                    }}
                    type="button"
                    className="hover:text-destructive text-lg opacity-75 hover:opacity-100 transition-all"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-sm">
              {props.placeholder || "Select from the list"}
            </div>
          )}
          <button
            type="button"
            className="absolute right-0 w-7 justify-center h-full items-center"
          >
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </div>
      </PopoverTrigger>
      {props.name && (
        <input
          hidden
          name={props.name}
          value={selectedItems?.map((i) => i.value).join(",")}
        />
      )}
      <PopoverContent className="w-full p-0 relative overflow-clip">
        <Command
          className={cn(
            "rounded-lg border shadow-md w-max min-w-[200xp] max-w-[630px]",
            props.contentClassName
          )}
        >
          <CommandInput
            autoFocus
            placeholder={
              props.inputPlaceholder || "Type a command or search..."
            }
          />
          <CommandList className="w-full">
            <CommandEmpty className="p-6 text-center w-full">
              No results found.
            </CommandEmpty>
            <CommandGroup heading={props.contentHintText || "Available Groups"}>
              <div className="pr-2 sm:pr-4 divide-y">
                {options.map((option) => {
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
                      onSelect={() => handleSelect(option)}
                    >
                      {option.label || option.title}
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
