"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/ui/utils";

type Props = {
  id?: string;
  name: string;
  authUserId?: ID;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function StaffsSelect(props: Props) {
  const { name, disabled, required } = props;

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const staffsQuery = useQuery({
    queryKey: ["staffs", props.authUserId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await actionRequest<Staff[]>({
        method: "get",
        url: "/organization/staffs/",
      });

      if (!response.success) throw response;

      if (props.defaultValue) {
        handleValueChange(props.defaultValue);
      }

      return response.data;
    },
  });

  function handleValueChange(staff_id: string) {
    const staff = staffsQuery.data?.find(
      (staff) => staff.id.toString() === staff_id?.toString()
    );
    setSelectedStaff(staff || null);
  }

  return (
    <Select
      required={required}
      disabled={disabled}
      key={selectedStaff?.id}
      name={name || `staff`}
      defaultValue={selectedStaff?.id.toString()}
      onValueChange={(value) => handleValueChange(value)}
    >
      <SelectTrigger
        className={cn(
          "",
          props.triggerClassName,
          !selectedStaff && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        {selectedStaff
          ? `${selectedStaff.name}${
              selectedStaff.job_title && ` - ${selectedStaff.job_title}`
            }`
          : 
        <SelectValue placeholder={props.placeholder || "Select an option"} />
      }
      </SelectTrigger>
      <SelectContent className={cn("")}>
        <SelectGroup className="m-0 p-1">
          <SelectLabel className="px-4">
            {staffsQuery.data && staffsQuery.data.length
              ? "Select a Staff"
              : "No staff found"}
            {staffsQuery.isLoading && "Loading Staffs"}
          </SelectLabel>
          {staffsQuery.data?.map((staff) => {
            return (
              <SelectItem
                key={staff.id}
                value={String(staff.id)}
                className="p-0"
              >
                <div className="flex items-center gap-2 p-1.5">
                  <Avatar className="md:w-10 md:h-10 w-8 h-8">
                    <AvatarImage src={"/avatar.webp"} />
                  </Avatar>
                  <div className="">
                    {staff.name}
                    <p>
                      <small>
                        <span className="text-muted-foreground">
                          {staff.job_title ? `${staff.job_title} - ` : " - "}
                        </span>
                        <span className="text-muted-foreground">
                          {departmentName(staff.unit.department)}
                        </span>
                      </small>
                    </p>
                  </div>
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
