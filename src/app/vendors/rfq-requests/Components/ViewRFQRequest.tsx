"use client";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import APP_COMPANY from "@/APP_COMPANY";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";
import OpenedBy from "@/Components/widget/OpenedBy";
import Link from "next/link";
import { generate_unique_id } from "@/lib/helpers/generator";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";

type Props = {
  user: AuthUser;
  data: RFQRequest;
  autoFocus?: boolean;
  onClose?: () => void;
  onReject?: () => void;
  onAccept?: () => void;
};

export default function ViewRFQRequest(props: Props) {
  const [isOpen, setOpen] = useState(props.autoFocus);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setOpen(opened);
        if (!opened) props.onClose?.();
      }}
    >
      <DialogContent className="max-w-[1200px] w-full max-h-[98dvh] min-h-[60svh] overflow-hidden overflow-y-auto border-4 shadow-xl">
        <div className="flex justify-between gap-4 pr-8">
          <div className="text-sm">
            {/* <p>
								From: <b className="font-semibold">{APP_COMPANY.name}</b>
							</p> */}
            <p>
              To: <b className="text-lg pl-1">{props.user.meta.vendor?.name}</b>
            </p>
            <div className="pt-1 space-y-1">
              {/* <p className="text-sm text-muted-foreground">
								Authorized by:{" "}
								<b className="pl-2">{props.data.quotation.officer?.name}</b>
							</p> */}
              <p className="text-sm text-muted-foreground">
                Issued Date:{" "}
                <b className="pl-2">{format(props.data.created_date, "PP")}</b>
              </p>
              <p className="text-sm text-muted-foreground">
                Deadline Date:{" "}
                <b className="pl-2">
                  {format(props.data.quotation_deadline_date, "PP")}
                </b>
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link href={`/form-101?m=rfq-request&i=${props.data.id}`}>
              <Button size={"sm"} className="gap-2 text-base font-semibold">
                <Eye width={15} />
                <span>Form 101</span>
              </Button>
            </Link>
          </div>
          <div className="grid">
            <div className="text-sm">
              <p className="text-sm text-muted-foreground">
                RFQ No:{" "}
                <b className="pl-2">
                  {generate_unique_id("RFQ", props.data.id)}
                </b>
              </p>
              <p className="text-sm text-muted-foreground">
                Quotation No:{" "}
                <b className="pl-2">
                  {props.data.my_response_id
                    ? generate_unique_id("QR", props.data.my_response_id)
                    : "------"}
                </b>
              </p>
            </div>
          </div>
        </div>

        {isOpen && (
          <div data-wrapper className="items h-full pr-4 overflow-auto">
            <div className="flex justify-between gap-4">
              <p className="font-semibold pb-2">Quotation Items</p>
              {!["approved", "rejected"].includes(props.data.my_response) && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={"destructive"}
                    size="sm"
                    onClick={props.onReject}
                  >
                    Reject
                  </Button>
                  <Button
                    variant={"success"}
                    size="sm"
                    onClick={props.onAccept}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>

            <TabularData
              plain
              data={props.data.items}
              columns={rfqRequestItemsColumns}
              wrapperClassName="min-h-max"
            />
            {/* <div className="mt-6">
              <OpenedBy rfq_id={props.data.id} />
            </div> */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const rfqRequestItemsColumns: ColumnDef<RFQRequestItem>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <small>{row.index + 1}</small>;
    },
  },
  {
    header: "Reference",
    accessorFn: (row) => generate_unique_id("QI", row.id),
  },
  {
    header: "Item Description",
    accessorKey: "item_description",
  },
  {
    header: "Qty",
    accessorKey: "quantity",
  },
  {
    header: "M-Unit",
    accessorKey: "measurement_unit",
  },
  {
    header: "Evaluation Criteria",
    accessorFn: (row) => row.eval_criteria || "No evaluation criteria",
  },
];
