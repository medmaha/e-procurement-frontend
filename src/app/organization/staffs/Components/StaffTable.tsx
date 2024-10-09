"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import DisableStaff from "./DisableStaff";
import EnableStaff from "./EnableStaff";
import { generate_unique_id } from "@/lib/helpers/generator";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/ui/badge";
import TabularData from "@/Components/widget/TabularData";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";
import AddStaff from "./AddStaff";
import { Input } from "@/Components/ui/input";
import { SearchIcon } from "lucide-react";

type Props = {
  user: AuthUser;
};

export default function StaffTable({ user }: Props) {
  const [permissions, setPermissions] = useState<AuthPerm>();

  const [selectedToBeUpdated, setSelectedToBeUpdated] = useState(null);
  const [staffToUpdate, setStaffToUpdate] = useState<Staff>();

  const staffsQuery = useQuery({
    queryKey: ["staffs", user.profile_id],
    staleTime: 1000 * 60 * 3,
    queryFn: async () => {
      const response = await actionRequest<Staff[]>({
        method: "get",
        url: "/organization/staffs/",
      });

      if (!response.success) throw response;

      setPermissions(response.auth_perms);
      return response.data;
    },
  });

  return (
    <>
      {staffToUpdate && (
        <AddStaff
          autoOpen
          user={user}
          staff={staffToUpdate}
          onClose={() => setStaffToUpdate(undefined)}
        />
      )}
      <div className="section-heading">
        <div className="relative">
          <Input
            className="md:w-[300px] pr-4"
            placeholder="Search by staff name or unit"
          />
          <Button
            variant="secondary"
            size={"icon"}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
        {permissions?.create && (
          <div className="grid items-center">
            <AddStaff text={"Add Staff"} user={user} autoOpen={false} />
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="table-wrapper">
          <TabularData
            data={staffsQuery.data}
            loading={staffsQuery.isLoading}
            columns={staffColumns(user, setStaffToUpdate, permissions)}
          />
        </div>
      </div>
    </>
  );
}

function staffColumns(user: AuthUser, updateStaff: any, perms?: AuthPerm) {
  const columns: Array<ColumnDef<Staff>> = [
    {
      accessorKey: "id",
      header: "Reference ID",
      cell: (params) => {
        const staff = params.row.original;
        return (
          <Link
            href={`/organization/staffs/${staff.id}`}
            className="link transition underline-offset-4 hover:underline"
          >
            {generate_unique_id("EMP", staff.id)}
          </Link>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Full Name",
    },
    {
      accessorKey: "job_title",
      header: "Position",
    },
    {
      accessorKey: "unit.name",
      header: "Unit",
      cell: (params) => {
        const staff = params.row.original;
        return (
          <Link
            href={`/organization/units/${staff.unit.id}`}
            className="transition underline-offset-4 hover:underline"
          >
            {staff.unit.name || "-"}
          </Link>
        );
      },
    },

    {
      accessorKey: "unit.department.name",
      header: "Department",
      cell: (params) => {
        const staff = params.row.original;
        return (
          <Link
            href={`/organization/units/${staff.unit.department.id}`}
            className="transition underline-offset-4 hover:underline"
          >
            {staff.unit.department.name || "-"}
          </Link>
        );
      },
    },
    {
      accessorKey: "disabled",
      header: "Status",
      cell: (params) => {
        const staff = params.row.original;
        return (
          <Badge variant={staff.disabled ? "destructive" : "outline"}>
            {staff.disabled ? "Disable" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: () => <span className="inline-block w-max">Action</span>,
      cell: (params) => {
        const staff = params.row.original;
        return (
          <span className="inline-flex justify-center items-center gap-1 w-max">
            {perms?.update && (
              <Button
                onClick={() => updateStaff(staff)}
                size={"sm"}
                variant={"secondary"}
                className="text-sm"
              >
                Update
              </Button>
            )}

            {staff.id !== user.profile_id && (
              <>
                {!staff.disabled && <DisableStaff staff={staff} />}
                {staff.disabled && <EnableStaff staff={staff} />}
              </>
            )}
          </span>
        );
      },
    },
  ];
  return columns;
}
