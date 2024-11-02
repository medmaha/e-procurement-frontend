"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/Components/ui/badge";

import TabularData from "@/Components/widget/TabularData";
import { generate_unique_id } from "@/lib/helpers/generator";
import Tooltip from "@/Components/ui/tooltip";
import { lazy, Suspense, useMemo, useState } from "react";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { EyeIcon } from "lucide-react";

type Props = {
  user: AuthUser;
  data?: RFQResponse[];
  isLoading?: boolean;
  permissions?: AuthPerm;
};

const ViewRFQResponseLazy = lazy(() => import("./ViewRFQResponse"));

export default function RFQResponseTable({ user, ...props }: Props) {
  const [selectedRFQ, setSelectedRFQ] = useState({
    rfq: null as null | RFQResponse,
    mood: null as null | "read",
  });

  const rfqColumns = useMemo(() => {
    const viewRFQ = (rfq: RFQResponse) => {
      setSelectedRFQ({ rfq, mood: "read" });
    };
    return columns(viewRFQ);
  }, [user, props.permissions]);

  function onClose() {
    setSelectedRFQ({ rfq: null, mood: null });
  }

  return (
    <>
      <Suspense>
        {selectedRFQ.rfq && (
          <>
            {selectedRFQ.mood === "read" && (
              <ViewRFQResponseLazy
                autoFocus
                user={user}
                data={selectedRFQ.rfq as any}
                onClose={onClose}
              />
            )}
          </>
        )}
      </Suspense>
      <TabularData
        data={props.data}
        loading={props.isLoading}
        columns={rfqColumns}
      />
    </>
  );
}

export const columns = (viewRFQ?: (rfq: RFQResponse) => void) => {
  return [
    {
      accessorKey: "id",
      header: "Reference",
      cell: ({ row }) => (
        <Link
          href={`/procurement/rfq/${row.getValue("id")}`}
          className="link hover:underline underline-offset-4 transition"
        >
          {generate_unique_id("QR", row.getValue("id"))}
        </Link>
      ),
    },
    {
      header: "RFQ Reference",
      accessorFn: (row) => generate_unique_id("RFQ", row.id),
    },
    {
      accessorKey: "created_date",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.getValue("created_date")), "PPp"),
    },
    {
      header: "My Respond",
      accessorKey: "status",
      cell: ({ row }) => {
        const approval_status =
          row.original.status.toLowerCase() as typeof row.original.status;
        if (!approval_status || approval_status === "pending")
          return (
            <Badge variant={"outline"}>
              <span>Pending</span>
            </Badge>
          );

        if (approval_status === "approved")
          return (
            <Badge>
              <span>Responded</span>
            </Badge>
          );

        if (approval_status === "rejected")
          return (
            <Badge variant={"destructive"}>
              <span>Rejected</span>
            </Badge>
          );

        return approval_status;
      },
    },
    {
      header: "Total Price",
      accessorFn: (row) => formatNumberAsCurrency(row.pricing),
    },
    {
      header: "Evaluation Status",
      accessorKey: "approval_status",
      cell: ({ row }) => {
        const approval_status = row.original.approved_status;

        let statusVariant;

        switch (approval_status) {
          case "ACCEPTED":
            statusVariant = "success";
            break;
          case "REJECTED":
            statusVariant = "destructive";
            break;

          case "PROCESSING":
          default:
            statusVariant = "outline";
            break;
        }

        return (
          <Badge variant={statusVariant as any}>
            <span>{approval_status}</span>
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        const myResponsePending = !["approved", "rejected"].includes(
          row.original.status
        );

        return (
          <div className="flex items-center gap-1">
            <Tooltip content={"View Requisition"}>
              <Button
                onClick={() => viewRFQ?.(row.original)}
                size={"sm"}
                variant={"secondary"}
              >
                <EyeIcon className="w-4 h-4" />
                View
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ] as ColumnDef<RFQResponse>[];
};
