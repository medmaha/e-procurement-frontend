"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { getDepartmentSelection } from "./actions";
import { cn } from "@/lib/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";

type Props = {
  id?: string;
  authUserId?: ID;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function DepartmentSelection(props: Props) {
  const { disabled, required, defaultValue, name } = props;

  const [selectedDepartment, setSelectedDepartment] = useState(defaultValue);

  const departmentQuery = useQuery({
    queryKey: ["departments", props.authUserId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await actionRequest<Department[]>({
        method: "get",
        url: "/organization/departments/",
      });

      if (!response.success) throw response;
      return response.data;
    },
  });

  return (
    <Select
      required={required}
      disabled={disabled}
      key={selectedDepartment}
      name={name || `department`}
      defaultValue={selectedDepartment}
      onValueChange={(value) => setSelectedDepartment(value)}
    >
      <SelectTrigger
        className={cn(
          "",
          props.triggerClassName,
          !selectedDepartment && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        <SelectValue
          className=""
          placeholder={props.placeholder || "Select an option"}
        />
      </SelectTrigger>
      <SelectContent className={cn("", props.contentClassName)}>
        <SelectGroup className="">
          <SelectLabel className="">Select A Department</SelectLabel>
          {departmentQuery.data?.map((department: any) => {
            return (
              <SelectItem key={department.id} value={String(department.id)}>
                {departmentName(department)}
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
