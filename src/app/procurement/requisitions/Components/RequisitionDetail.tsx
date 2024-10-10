"use client";
import { format } from "date-fns";
import Link from "next/link";

import { formatNumberAsCurrency } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import ApprovalDetails from "./ApprovalDetails";
import { generate_unique_id } from "@/lib/helpers/generator";
import { useMemo } from "react";

type Props = {
  user: AuthUser;
  loading: boolean;
  data?: RequisitionRetrieve;
};

export default function RequisitionDetail({ user, data, loading }: Props) {
  const itemsColumns = useMemo(() => {
    return requisitionItemColumns(user);
  }, [user]);
  return (
    <>
      <Accordion type="single" collapsible defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent className="transition duration-700 pb-6">
            <div className="flex items-center flex-wrap sm:grid gap-4 sm:grid-cols-4 grid-cols-2 w-full pt-4">
              <div className="grid">
                <p className="text-sm font-semibold leading-none">
                  Requisition ID
                </p>
                <p className="text-xs text-muted-foreground pt-0.5 truncate">
                  {data && generate_unique_id("REQ", data.id)}
                </p>
              </div>
              <div className="grid">
                <p className="text-sm font-semibold leading-none">Officer</p>
                <p className="text-xs text-muted-foreground pt-0.5 truncate">
                  <Link
                    href={`/organization/staffs/${data?.officer.id}`}
                    className="transition hover:underline underline-offset-4 truncate"
                  >
                    {data?.officer.name}
                  </Link>
                </p>
              </div>
              <div className="grid">
                <p className="text-sm font-semibold leading-none">
                  Total Amount
                </p>
                <p
                  title={data?.officer.unit.name}
                  className="text-xs  pt-0.5 truncate font-semibold"
                >
                  {new Intl.NumberFormat("en-US", {
                    currency: "GMD",
                    style: "currency",
                  }).format(
                    data?.items.reduce((acc, item) => {
                      const total = acc + Number(item.total_cost);
                      return total;
                    }, 0) || 0
                  )}
                </p>
              </div>
              <div className="grid">
                <p className="text-sm font-semibold leading-none">Department</p>
                <p
                  title={data?.officer.department.name}
                  className="text-xs text-muted-foreground pt-0.5 truncate"
                >
                  <Link
                    href={`/organization/staffs/${data?.officer.department.id}`}
                    className="transition hover:underline underline-offset-4 truncate"
                  >
                    {data?.officer.department.name}
                  </Link>
                </p>
              </div>

              <div className="grid">
                <p className="text-xs font-semibold leading-none">
                  Procurement Method
                </p>
                <p className="text-sm text-muted-foreground pt-0.5 uppercase">
                  {data?.approval.procurement_method}
                </p>
              </div>

              <div className="grid">
                <p className="text-sm font-semibold leading-none">
                  Date Issued
                </p>
                <p
                  title={data?.created_date}
                  className="text-xs text-muted-foreground pt-0.5 truncate"
                >
                  {data?.created_date &&
                    format(new Date(data?.created_date), "PPp")}
                </p>
              </div>
              <div className="grid">
                <p className="text-sm font-semibold leading-none">
                  Last Modified
                </p>
                <p
                  title={data?.created_date}
                  className="text-xs text-muted-foreground pt-0.5 truncate"
                >
                  {data?.created_date &&
                    format(new Date(data?.last_modified), "PPp")}
                </p>
              </div>
              <div className="grid">
                <p className="text-sm font-semibold leading-none">
                  Request Type
                </p>
                <p
                  title={data?.request_type}
                  className="text-xs text-muted-foreground pt-0.5 truncate"
                >
                  {data?.request_type || "N/A"}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" defaultValue="items" collapsible>
        <AccordionItem value="items">
          <AccordionTrigger>Requisition Items</AccordionTrigger>
          <AccordionContent className="transition duration-700 pb-6">
            <TabularData
              plane
              wrapperClassName="min-h-[15svh]"
              loading={loading}
              data={data?.items}
              columns={itemsColumns}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="approvals">
          <AccordionTrigger>Approval Records</AccordionTrigger>
          <AccordionContent className="transition duration-700 pb-6">
            <ApprovalDetails user={user} data={data} loading={loading} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

const requisitionItemColumns = (
  user: AuthUser
): ColumnDef<RequisitionItem>[] => [
  {
    header: "Item",
    accessorKey: "description",
  },
  {
    header: "M-Unit",
    accessorKey: "measurement_unit",
  },
  {
    header: "Qty",
    accessorKey: "quantity",
  },
  {
    header: "Unit Cost",
    accessorKey: "unit_cost",
    cell: ({ row: { original: data } }) => {
      return formatNumberAsCurrency(data?.unit_cost);
    },
  },
  {
    header: "Total Cost",
    accessorKey: "total_cost",
    cell: ({ row: { original: data } }) => {
      return formatNumberAsCurrency(data?.total_cost);
    },
  },
  {
    header: "Remark",
    accessorKey: "remark",
    cell: ({ row: { original: data } }) => {
      return (
        <p className="text-xs text-wrap max-w-[220px] min-w-[100px]">
          {data?.remark || "N/A"}
        </p>
      );
    },
  },
];
