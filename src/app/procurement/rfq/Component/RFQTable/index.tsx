"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import {
  ArrowUpRightSquareIcon,
  CheckCircle2,
  ChevronsUpDownIcon,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistance } from "date-fns";
import AddRFQ from "../CreateRFQ";
import Approval from "../Approval";
import PublishRFQ from "../PublishRFQ";
import { Badge } from "@/Components/ui/badge";
import { isDeadlineDate } from "../../responses/helpers";

import TabularData from "@/Components/widget/TabularData";
import { useMemo } from "react";

type Props = {
  user: AuthUser;
  data: RFQ[];
};
export default function RFQTable({ data, user }: Props) {
  const rfqColumns = useMemo(() => {
    return columns(user);
  }, [user]);

  return <TabularData data={data} loading={false} columns={rfqColumns} />;
}

export const columns = (user: AuthUser) => {
  return [
    {
      enableHiding: false,
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.index + 1}.</span>
      ),
    },
    {
      accessorKey: "unique_id",
      header: "ID",
      cell: ({ row }) => (
        <Link
          href={`/procurement/rfq/${row.getValue("unique_id")}`}
          className="link hover:underline underline-offset-4 transition"
        >
          {row.getValue("unique_id")}
        </Link>
      ),
    },
    {
      id: "form-101",
      header: "Form-101",
      cell: ({ row }) => (
        <a
          target="_blank"
          href={`/form-101?m=rfq&i=${row.getValue("unique_id")}&close=true`}
        >
          <Button variant={"outline"} size={"sm"} className="gap-1.5">
            Review <ArrowUpRightSquareIcon className="h-4 w-4" />
          </Button>
        </a>
      ),
    },
    {
      accessorKey: "officer.name",
      header: "Officer",
      cell: ({ row }) => (
        <Link
          href={`/organization/staff/${row.original.officer.id}`}
          className="hover:text-primary hover:underline underline-offset-4 transition"
        >
          {row.original.officer.name}
        </Link>
      ),
    },
    {
      accessorKey: "published",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left pl-0 h-max hover:bg-transparent"
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Publish Status
            <ChevronsUpDownIcon className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const published = row.getValue("published");
        return (
          <div className="w-full">
            {published ? (
              <Badge>
                <CheckCircle2 width={16} height={16} />
                <span>Published</span>
              </Badge>
            ) : (
              <Badge variant={"destructive"}>
                <XCircle width={16} height={16} />
                <span>Unpublished</span>
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_date",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.getValue("created_date")), "PPp"),
    },
    {
      accessorKey: "deadline",
      header: "Deadline Date",
      cell: ({ row }) =>
        formatDistance(new Date(row.getValue("deadline")), new Date(), {
          addSuffix: true,
        }),
    },

    {
      accessorKey: "open_status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-left pl-0 h-max hover:bg-transparent"
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ChevronsUpDownIcon className="ml-2 h-3 w-3" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const original = row.original;

        return original.open_status ? (
          <Badge>
            <span>Open</span>
          </Badge>
        ) : (
          <Badge variant={"destructive"}>
            <span>Closed</span>
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

        const deadline = isDeadlineDate(rfq.deadline);

        return (
          <div className="flex items-center w-full gap-1">
            {rfq.approvable && isAuthor && (
              <div className="">
                <AddRFQ user={user} rfq={rfq}>
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="font-semibold"
                  >
                    Update
                  </Button>
                </AddRFQ>
              </div>
            )}
            {rfq.approvable && (
              <Approval rfq={rfq} user={user}>
                <Button size={"sm"} className="font-semibold">
                  Approve
                </Button>
              </Approval>
            )}
            {rfq.publishable && (
              <>
                {isAuthor ? (
                  <PublishRFQ rfq_id={rfq.id} />
                ) : (
                  <p className="text-muted-foreground pl-4 text-xs font-semibold w-full">
                    N/A
                  </p>
                )}
              </>
            )}
            {!rfq.approvable && !rfq.publishable && !deadline && (
              <p className="text-muted-foreground text-xs pl-5 font-semibold w-full">
                N/A
              </p>
            )}
            {deadline && (
              <Link href={`/procurement/rfq/responses?search=${rfq.unique_id}`}>
                <Button size={"sm"} variant={"default"}>
                  View Quotations
                </Button>
              </Link>
            )}
          </div>
        );
      },
    },
  ] as ColumnDef<RFQ>[];
};
