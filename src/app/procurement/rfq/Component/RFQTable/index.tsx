"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import { CheckCircle2, EditIcon, EyeIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { format, isAfter } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { isDeadlineDate } from "../../responses/helpers";

import TabularData from "@/Components/widget/TabularData";
import { useMemo, useState } from "react";
import { generate_unique_id } from "@/lib/helpers/generator";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import Tooltip from "@/Components/ui/tooltip";
import RFQApproval from "../RFQApproval";

type Props = {
  user: AuthUser;
  data?: RFQ[];
  isLoading?: boolean;
  permissions?: AuthPerm;
  viewRFQ?: (id: ID) => void;
  updateRFQ?: (id: ID) => void;
};

export default function RFQTable({ user, ...props }: Props) {
  const [selectedRFQ, setSelectedRFQ] = useState({
    rfq: null as null | RFQ,
    mood: null as null | "read" | "update" | "approve",
  });

  const rfqColumns = useMemo(() => {
    const viewRFQ = () => {};
    const updateRFQ = () => {};
    const approveRFQ = (rfq: RFQ) => {
      setSelectedRFQ({ rfq, mood: "approve" });
    };

    return columns(user, props.permissions, viewRFQ, updateRFQ, approveRFQ);
  }, [user, props.permissions]);

  return (
    <>
      {selectedRFQ.rfq && (
        <>
          {selectedRFQ.mood === "approve" && (
            <RFQApproval
              autoOpen
              onClose={() => setSelectedRFQ({ rfq: null, mood: null })}
              user={user}
              rfq={selectedRFQ.rfq}
            />
          )}
        </>
      )}
      <TabularData
        data={props.data}
        loading={props.isLoading}
        columns={rfqColumns}
      />
    </>
  );
}

export const columns = (
  user: AuthUser,
  permissions?: AuthPerm,
  viewRFQ?: (id: ID) => void,
  updateRFQ?: (id: ID) => void,
  approveRFQ?: (rfq: RFQ) => void
) => {
  return [
    {
      accessorKey: "id",
      header: "Reference",
      cell: ({ row }) => (
        <Link
          href={`/procurement/rfq/${row.getValue("id")}`}
          className="link hover:underline underline-offset-4 transition"
        >
          {generate_unique_id("RFQ", row.getValue("id"))}
        </Link>
      ),
    },
    {
      accessorKey: "officer.name",
      header: "Officer",
      cell: ({ row }) => <StaffAvatar staff={row.original.officer} />,
    },
    {
      accessorKey: "created_date",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.getValue("created_date")), "PPp"),
    },
    {
      accessorKey: "quotation_deadline_date",
      header: "Deadline Date",
      cell: ({ row }) => {
        const deadline: string = row.getValue("quotation_deadline_date");

        if (!deadline) return null;

        return format(new Date(deadline), "PPp");
      },
    },

    {
      header: "Approval",
      accessorKey: "approval_status",
      cell: ({ row }) => {
        const approval_status = row.original.approval_status;

        if (approval_status === "approved")
          return (
            <Badge>
              <CheckCircle2 width={16} height={16} />
              <span>Approved</span>
            </Badge>
          );

        if (approval_status === "pending")
          return (
            <Badge variant={"outline"}>
              <span>Pending</span>
            </Badge>
          );

        return (
          <Badge variant={"destructive"}>
            <span>Rejected</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        const rfq = row.original;

        const isAuthor =
          rfq.officer.id === user.profile_id && user.profile_type === "Staff";

        const deadline = isDeadlineDate(rfq.quotation_deadline_date);
        // const isDue = isAfter(
        //   new Date(),
        //   new Date(rfq.quotation_deadline_date)
        // );

        const editable = false;
        return (
          <div className="flex items-center gap-1">
            <Tooltip
              content={"View Requisition"}
              // content={isDue ? "View Requisition" : "Deadline Date is due"}
            >
              <Button
                onClick={() => viewRFQ?.(row.original.id)}
                // onClick={() => (!isDue ? {} : viewRFQ?.(row.original.id))}
                size={"icon"}
                className="rounded-full disabled:opacity-50"
                variant={"secondary"}
                // disabled={isDue}
              >
                <EyeIcon className="w-4 h-4" />
                {/* {isDue ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <LockIcon className="text-destructive w-4 h-4" />
                )} */}
              </Button>
            </Tooltip>
            {editable && (
              <Button
                onClick={() => updateRFQ?.(row.original.id)}
                size={"icon"}
                title="Edit Requisition"
                variant={"secondary"}
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            )}
            {permissions?.approve && rfq.approval_status === "pending" && (
              <Button onClick={() => approveRFQ?.(row.original)} size={"sm"}>
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ] as ColumnDef<RFQ>[];
};
