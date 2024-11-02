import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import {
  CheckCircle2Icon,
  ChevronsUpDownIcon,
  Loader2,
  LockIcon,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { isDeadlineDate } from "../../helpers";
import { Badge } from "@/Components/ui/badge";
import { generate_unique_id } from "@/lib/helpers/generator";

export const columns = (user: AuthUser) => {
  return [
    // {
    // 	id: "select",
    // 	header: ({ table }) => (
    // 		<Checkbox
    // 			checked={
    // 				table.getIsAllPageRowsSelected() ||
    // 				(table.getIsSomePageRowsSelected() && "indeterminate")
    // 			}
    // 			onCheckedChange={(value: any) =>
    // 				table.toggleAllPageRowsSelected(!!value)
    // 			}
    // 			aria-label="Select all"
    // 		/>
    // 	),
    // 	cell: ({ row }) => (
    // 		<Checkbox
    // 			checked={row.getIsSelected()}
    // 			onCheckedChange={(value: any) => row.toggleSelected(!!value)}
    // 			aria-label="Select row"
    // 		/>
    // 	),
    // 	enableSorting: false,
    // 	enableHiding: false,
    // },
    {
      // accessorKey: "#",
      enableHiding: false,
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.index + 1}.</span>
      ),
    },
    {
      accessorKey: "id",
      header: "Quotation ID",
      cell: ({ row }) => (
        <Link
          href={`/procurement/rfq/responses/${row.getValue("id")}`}
          className="link hover:underline underline-offset-4 transition"
        >
          {generate_unique_id("QR", row.getValue("id"))}
        </Link>
      ),
    },
    {
      accessorKey: "rfq.id",
      header: "RFQ ID",

      cell: ({ row }) => {
        const rfq = row.original.rfq;
        return (
          <Link
            href={`/procurement/rfq/${rfq.id}`}
            className="hover:underline underline-offset-4 transition"
          >
            {generate_unique_id("RFQ", rfq.id)}
          </Link>
        );
      },
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left pl-0 h-max hover:bg-transparent"
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Deadline
            <ChevronsUpDownIcon className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="">
          {format(new Date(row.getValue("deadline")), "PPP")}
        </div>
      ),
    },
    {
      accessorKey: "vendor.name",
      header: "Vendor",
      cell: ({ row }) => {
        const quotation = row.original;
        return (
          <Link
            href={`/suppliers/${quotation.vendor.id}`}
            className="hover:underline underline-offset-4 transition"
          >
            {quotation.vendor.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "last_modified",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left pl-0 h-max hover:bg-transparent"
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted At
            <ChevronsUpDownIcon className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const last_modified = row.getValue<string>("last_modified");
        return (
          <div className="text-sm">
            <small>{format(new Date(last_modified), "PPPp")}</small>
          </div>
        );
      },
    },
    {
      id: "Evaluation Status",
      header: "Evaluation Status",
      cell: ({ row }) => {
        const rfqResponse = row.original;
        const status = rfqResponse.evaluation?.length ? "submitted" : "pending";
        return (
          <div className="inline-flex gap-1.5 capitalize items-center">
            {status === "submitted" && (
              <Badge variant={"success"} className="p-1 px-2 gap-2">
                <CheckCircle2Icon width={16} height={16} />
                <span>Processing</span>
              </Badge>
            )}
            {status === "pending" && (
              <Badge variant={"outline"} className="p-1 px-2 gap-2">
                <Loader2 width={15} height={15} />
                <span>{status}</span>
              </Badge>
            )}
            {/* @ts-ignore */}
            {status === "rejected" && (
              <Badge variant={"destructive"} className="p-1 px-2 gap-2">
                <XCircle className="text-destructive" width={15} height={15} />
                <span>Declined</span>
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Response Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();
        return (
          <div className="inline-flex items-center gap-1.5 capitalize font-semibold text-sm">
            {status === "approved" ? (
              <Badge variant={"outline"} className="p-1 px-2 gap-2">
                <CheckCircle2Icon width={16} height={16} />
                <span>Quoted</span>
              </Badge>
            ) : status === "pending" ? (
              <Badge variant={"outline"} className="p-1 px-2 gap-2">
                <Loader2 className="animated-spin" width={15} height={15} />
                <span>Pending</span>
              </Badge>
            ) : (
              <Badge variant={"destructive"} className="p-1 px-2 gap-2">
                <XCircle className="text-destructive" width={15} height={15} />
                <span>Declined</span>
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        const rfqResponse = row.original;

        const deadline = isDeadlineDate(
          rfqResponse.rfq.quotation_deadline_date
        );

        if (!deadline) {
          return (
            <p
              title="Wait for the deadline date!"
              className="font-semibold text-sm pl-5 text-destructive"
            >
              <LockIcon size={18} />
            </p>
          );
        }

        return (
          <>
            <Link href={"/procurement/rfq/responses/" + rfqResponse.id}>
              <Button size={"sm"}>Details</Button>
            </Link>
          </>
        );
      },
    },
  ] as ColumnDef<RFQResponse>[];
};
