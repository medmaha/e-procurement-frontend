"use client";
import React, { useMemo } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import TabularData from "@/Components/widget/TabularData";

type Props = {
  user: AuthUser;
  loading: boolean;
  data?: RequisitionRetrieve;
};

export default function ApprovalDetails({ user, data, loading }: Props) {
  const columns = useMemo(() => {
    return requisitionApprovalColumns(user);
  }, [user]);

  return (
    <TabularData
      loading={loading}
      columns={columns}
      data={approvalsToList(data?.approval)}
    />
  );
}

const approvalsToList = (approval?: RequisitionRetrieveApproval) => {
  const {
    unit_approval,
    department_approval,
    procurement_approval,
    status,
    finance_approval,
  } = approval || {};

  return [
    unit_approval,
    department_approval,
    procurement_approval,
    finance_approval,
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
          {approval}
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
