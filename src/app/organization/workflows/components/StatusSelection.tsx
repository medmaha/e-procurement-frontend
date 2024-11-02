"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { cn } from "@/lib/ui/utils";

type Props = {
  name?: string;
  inserts: string[];
  noColor?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export default function StatusSelection({ noColor, ...props }: Props) {
  const [value, setValue] = useState(props.defaultValue);
  return (
    <Select
      name={props.name || "status"}
      defaultValue={value}
      onValueChange={(value) => {
        setValue(value);
        props.onChange?.(value);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-full sm:w-40 capitalize",
          !noColor && value === "active" && "text-primary",
          !noColor && value === "inactive" && "text-destructive"
        )}
      >
        <SelectValue placeholder={props.placeholder || "Filter by status"} />
      </SelectTrigger>
      <SelectContent>
        {props.inserts?.map((item) => {
          return (
            <SelectItem
              key={item.valueOf()}
              className="capitalize"
              value={item.toLowerCase()}
            >
              {item}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
