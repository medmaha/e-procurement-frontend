"use client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { generate_unique_id } from "@/lib/helpers/generator";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";
import { Input } from "@/Components/ui/input";
import { EditIcon, SearchIcon } from "lucide-react";

import AddOrEditStaff from "./AddOrEditStaff";
import StaffActivation from "./StaffActivation";
import TabularData from "@/Components/widget/TabularData";

type Props = {
  user: AuthUser;
};

export default function StaffTable({ user }: Props) {
  const [permissions, setPermissions] = useState<AuthPerm>();

  const [selectedToBeUpdated, setStaffToActivate] = useState<Staff>();
  const [staffToUpdate, setStaffToUpdate] = useState<Staff>();
  4;

  const columns = useMemo(() => {
    return staffColumns(
      user,
      setStaffToUpdate,
      setStaffToActivate,
      permissions
    );
  }, [user, permissions]);

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
        <AddOrEditStaff
          autoOpen
          user={user}
          staff={staffToUpdate}
          onClose={() => setStaffToUpdate(undefined)}
        />
      )}
      {selectedToBeUpdated && (
        <StaffActivation
          staff={selectedToBeUpdated}
          user={user}
          onClose={() => setStaffToActivate(undefined)}
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
            <AddOrEditStaff user={user} autoOpen={false}>
              <Button>
                Add Staff
              </Button>
            </AddOrEditStaff>
          </div>
        )}
      </div>
      <TabularData
        data={staffsQuery.data}
        loading={staffsQuery.isLoading}
        columns={columns}
      />
    </>
  );
}

function staffColumns(
  user: AuthUser,
  updateStaff: any,
  activateStaff: any,
  perms?: AuthPerm
) {
  const columns: Array<ColumnDef<Staff>> = [
    {
      accessorKey: "id",
      header: "Reference",
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
            {!staff.disabled && perms?.update && (
              <Button
                onClick={() => updateStaff(staff)}
                size={"icon"}
                variant={"secondary"}
                title="Edit Staff"
                className="rounded-full"
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            )}

            {staff.id !== user.profile_id && (
              <>
                {!staff.disabled && (
                  <Button
                    onClick={() => activateStaff(staff)}
                    size={"sm"}
                    variant={"destructive"}
                  >
                    Disable
                  </Button>
                )}
                {staff.disabled && (
                  <Button
                    onClick={() => activateStaff(staff)}
                    size={"sm"}
                    variant={"secondary"}
                  >
                    Enable
                  </Button>
                )}
              </>
            )}
          </span>
        );
      },
    },
  ];
  return columns;
}
