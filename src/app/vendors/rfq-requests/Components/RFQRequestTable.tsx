"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import { CheckCircle2, EyeIcon } from "lucide-react";
import Link from "next/link";
import { format, isAfter } from "date-fns";
import { Badge } from "@/Components/ui/badge";

import TabularData from "@/Components/widget/TabularData";
import { generate_unique_id } from "@/lib/helpers/generator";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import Tooltip from "@/Components/ui/tooltip";
import { lazy, Suspense, useMemo, useState } from "react";

type Props = {
  user: AuthUser;
  data?: RFQRequest[];
  isLoading?: boolean;
  permissions?: AuthPerm;
};

const ViewRFQRequestLazy = lazy(() => import("./ViewRFQRequest"));
const RejectRFQRequestLazy = lazy(() => import("./RejectRFQRequest"));
const AcceptRFQRequestLazy = lazy(() => import("./AcceptRFQRequest"));

export default function RFQRequestTable({ user, ...props }: Props) {
  const [selectedRFQ, setSelectedRFQ] = useState({
    rfq: null as null | RFQRequest,
    mood: null as null | "read" | "reject" | "accept",
  });

  const rfqColumns = useMemo(() => {
    const viewRequest= (rfq: RFQRequest) => {
      setSelectedRFQ({ rfq, mood: "read" });
    };
    const rejectRequest= (rfq: RFQRequest) => {
      setSelectedRFQ({ rfq, mood: "reject" });
    };
    const acceptRequest = (rfq: RFQRequest) => {
      setSelectedRFQ({ rfq, mood: "accept" });
    };

    return columns(viewRequest, rejectRequest, acceptRequest);
  }, []);

  function onClose() {
    setSelectedRFQ({ rfq: null, mood: null });
  }

  return (
    <>
      <Suspense>
        {selectedRFQ.rfq && (
          <>
            {selectedRFQ.mood === "read" && (
              <ViewRFQRequestLazy
                autoFocus
                user={user}
                data={selectedRFQ.rfq}
                onClose={onClose}
                onReject={() => {
                  setSelectedRFQ((prev) => ({ ...prev, mood: "reject" }));
                }}
                onAccept={() => {
                  setSelectedRFQ((prev) => ({ ...prev, mood: "accept" }));
                }}
              />
            )}
            {selectedRFQ.mood === "reject" && (
              <RejectRFQRequestLazy
                closeDialog={onClose}
                autoFocus
                rfq_id={selectedRFQ.rfq.id.toString()}
              />
            )}
            {selectedRFQ.mood === "accept" && (
              <AcceptRFQRequestLazy
                autoFocus
                user={user}
                data={selectedRFQ.rfq}
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

export const columns = (
  viewRequest?: (rfq: RFQRequest) => void,
  rejectRequest?: (rfq: RFQRequest) => void,
  acceptRequest?: (rfq: RFQRequest) => void
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
      header: "My Respond",
      accessorKey: "approval_status",
      cell: ({ row }) => {
        const approval_status = row.original.my_response;
        if (!approval_status || approval_status === "pending")
          return (
            <Badge variant={"outline"}>
              <span>Pending</span>
            </Badge>
          );

        if (approval_status === "approved")
          return (
            <Badge>
              <CheckCircle2 width={16} height={16} />
              <span>Accepted</span>
            </Badge>
          );

        if (approval_status === "rejected")
          return (
            <Badge variant={"destructive"}>
              <span>Rejected</span>
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
          row.original.my_response
        );

        return (
          <div className="flex items-center gap-1">
            <Tooltip content={"View Requisition"}>
              <Button
                onClick={() => viewRequest?.(row.original)}
                size={"icon"}
                className="rounded-full disabled:opacity-50"
                variant={"secondary"}
              >
                <EyeIcon className="w-4 h-4" />
              </Button>
            </Tooltip>
            {myResponsePending && (
              <>
                <Tooltip content={"Reject Invitation"}>
                  <Button
                    onClick={() => rejectRequest?.(row.original)}
                    size={"sm"}
                    title="Edit Requisition"
                    variant={"destructive"}
                  >
                    Reject
                  </Button>
                </Tooltip>
                <Tooltip content={"Accept Invitation"}>
                  <Button
                    onClick={() => acceptRequest?.(row.original)}
                    size={"sm"}
                  >
                    Accept
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ] as ColumnDef<RFQRequest>[];
};
