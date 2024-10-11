"use client";
import React, { useMemo } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import TabularData from "@/Components/widget/TabularData";
import { cn } from "@/lib/ui/utils";
import Link from "next/link";

type Props = {
  user: AuthUser;
  loading: boolean;
  data?: RequisitionRetrieve;
};

export default function ApprovalDetails({ user, data, loading }: Props) {
  const columns = useMemo(() => {
    return requisitionApprovalColumns(user);
  }, [user, data]);

  return (
    <>
      <TabularData
        loading={loading}
        columns={columns}
        data={approvalsToList(data?.approval)}
        wrapperClassName={cn(
          "border border-t-none min-h-[15svh]",
          !loading && "min-h-[0px]"
        )}
        rowClassName="divide-x"
        headerClassName="divide-x bg-secondary/50"
        headerCellClassName="text-sm text-foreground"
      />
    </>
  );
}

const approvalsToList = (approval?: RequisitionRetrieveApproval) => {
  const {
    unit_approval,
    department_approval,
    procurement_approval,
    finance_approval,
  } = approval || {};

  return [
    { ...unit_approval, id: "unit_approval", name: "Unit Approval" },
    {
      ...department_approval,
      id: "department_approval",
      name: "Department Approval",
    },
    {
      ...finance_approval,
      id: "finance_approval",
      name: "Finance Approval",
    },
    {
      ...procurement_approval,
      id: "procurement_approval",
      name: "Procurement Approval",
    },
  ];
};

type Approval = ReturnType<typeof approvalsToList>[number];

const requisitionApprovalColumns = (user: AuthUser): ColumnDef<Approval>[] => [
  {
    header: "Stage",
    accessorKey: "name",
  },
  {
    header: "Officer",
    accessorKey: "officer?.name",
    cell: ({ row }) => {
      const stageOfficer = row.original?.officer;
      if (!stageOfficer) {
        return "N/A";
      }
      return (
        <Link
          href={"/organization/staffs/" + stageOfficer?.id}
          className={
            "transition hover:underline underline-offset-4 truncate hover:text-primary"
          }
        >
          {stageOfficer.name}
        </Link>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const approval = row.original?.approve?.toLowerCase();
      return (
        <Badge
          className="capitalize"
          variant={
            approval === "accepted"
              ? "default"
              : approval === "rejected"
              ? "destructive"
              : "outline"
          }
        >
          {approval || "Pending"}
        </Badge>
      );
    },
  },
  {
    header: "Remark",
    accessorKey: "remark",
    cell: ({ row: { original } }) => {
      return (
        <p className="text-xs line-clamp-2">{original?.remark || "N/A"}</p>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row: { original } }) => {
      return (
        <div className="w-max flex items-center">
          <Button size={"sm"} variant={"secondary"} className="rounded-full">
            <EyeIcon className="w-4 h-4" />
            View
          </Button>
        </div>
      );
    },
  },
];
