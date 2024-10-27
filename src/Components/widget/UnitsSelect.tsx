"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import CACHE from "@/lib/caching";
import { getUnitSelection } from "./actions";
import { cn } from "@/lib/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";

type UnitSelect = {
  id: ID;
  name: string;
  department: string;
};

type Props = {
  name?: string;
  authUserId?: ID;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
};

export default function UnitsSelect(props: Props) {
  const { authUserId, disabled, required } = props;

  const [selectedUnit, setSelectedUnit] = useState<Unit>();

  const unitsQuery = useQuery({
    queryKey: ["units", authUserId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await actionRequest<Unit[]>({
        method: "get",
        url: "/organization/units/",
      });
      if (!response.success) throw response;

      if (props.defaultValue) {
        setSelectedUnit(
          response.data.find((unit) => unit.id === props.defaultValue)
        );
      }
      return response.data;
    },
  });

  return (
    <Select
      key={selectedUnit?.id}
      defaultValue={selectedUnit?.id.toString()}
      name={props.name || "unit"}
      disabled={disabled}
      required={required}
      onValueChange={(value) => {
        setSelectedUnit(
          unitsQuery.data?.find(
            (unit) => unit.id?.toString() === value.toString()
          )
        );
      }}
    >
      <SelectTrigger
        className={cn(
          "bg-background text-sm disabled:pointer-events-none",
          !selectedUnit && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        {selectedUnit ? (
          <div className="inline-flex gap-1.5 text-sm">
            <span>{selectedUnit.name}</span>
            <span>{" - "}</span>
            <span className="text-muted-foreground">
              {departmentName(selectedUnit.department)}
            </span>
          </div>
        ) : (
          <SelectValue placeholder={props.placeholder || "Select an option"} />
        )}
      </SelectTrigger>
      <SelectContent className="p-0 m-0 w-full">
        <SelectGroup className="m-0 p-1">
          <SelectLabel className="px-4">
            {unitsQuery.isLoading
              ? "Loading..."
              : unitsQuery.data && unitsQuery.data.length > 0
              ? "Select a Unit"
              : "No Units Found"}
          </SelectLabel>
          {unitsQuery.data?.map((unit) => {
            return (
              <SelectItem key={unit.id} value={String(unit.id)} className="p-0">
                <div className="flex items-center gap-2 justify-between w-full p-2">
                  <span>{unit.name}</span>
                  <span>{" - "}</span>
                  <span className="text-muted-foreground">
                    {departmentName(unit.department)}
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function departmentName(department: Staff["unit"]["department"]) {
  if (!department) return "";

  if (department?.name.toLowerCase().includes("department"))
    return department.name;

  return `${department.name} Department`;
}
