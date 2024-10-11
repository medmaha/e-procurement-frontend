"use client";
import { useMemo } from "react";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import TabularData from "@/Components/widget/TabularData";
import { Button } from "@/Components/ui/button";
import { EditIcon, EyeIcon } from "lucide-react";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  readonly loading?: boolean;
  readonly user: AuthUser;
  readonly permission?: AuthPerm;
  readonly requisitions: Requisition[];
  readonly viewRequisition?: (requisition_id: string) => void;
  readonly updateRequisition?: (requisition_id: string) => void;
  readonly approveRequisition?: (requisition_id: string) => void;
};

export default function RequisitionsTable({
  user,
  requisitions,
  ...props
}: Props) {
  const columns = useMemo(() => {
    return getColumns(
      user,
      props.permission,
      props.viewRequisition,
      props.updateRequisition,
      props.approveRequisition
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <TabularData
      data={requisitions}
      columns={columns}
      loading={props.loading}
    />
  );
}

const getColumns = (
  user: AuthUser,
  permissions?: AuthPerm,
  viewRequisition?: any,
  updateRequisition?: any,
  approveRequisition?: any
) =>
  [
    {
      accessorKey: "id",
      header: "Reference",
      cell: ({ row }) => (
        <Link
          href={`/procurement/requisitions/${row.original.id}`}
          className="link hover:underline underline-offset-4 transition"
        >
          {generate_unique_id("REQ", row.original.id, 4)}
        </Link>
      ),
    },
    {
      accessorKey: "officer?.name",
      header: "Officer",
      cell: ({ row }) => (
        <Link
          href={`/organization/staffs/${row.original.officer.id}`}
          className="hover:text-primary hover:underline underline-offset-4 transition"
        >
          {row.original.officer.name}
        </Link>
      ),
    },

    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <p
          title={row.original.items.map((i) => i.description).join(", ")}
          className="max-w-[25ch] truncate"
        >
          <span className="capitalize">
            {row.original.items[0].description}
          </span>
          {row.original.items[1] && (
            <span className="capitalize">
              {", "}
              {row.original.items[1].description}
            </span>
          )}
          {row.original.items[2] && (
            <span className="text-xs text-muted-foreground px-2 pt-1">
              and {row.original.items.length - 2} more...
            </span>
          )}
        </p>
      ),
    },
    {
      id: "qty",
      header: "Total Qty",
      cell: ({ row }) => (
        <p className="w-max">
          {!row.original.items[1] && (
            <span>{row.original.items[0].quantity}</span>
          )}
          {row.original.items[1] && (
            <span>
              {row.original.items.reduce((value, item) => {
                return value + item.quantity;
              }, 0)}
            </span>
          )}{" "}
          <span className="text-muted-foreground">
            {row.original.items[0].measurement_unit}
          </span>
        </p>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const totalCost = row.original.items.reduce(
          (acc, item) => (acc += Number(item.total_cost)),
          0
        );

        return (
          <p className="w-max">
            {new Intl.NumberFormat("en-US", {
              currency: "GMD",
              style: "currency",
              currencyDisplay: "code",
            }).format(totalCost)}
          </p>
        );
      },
    },
    {
      accessorKey: "approval.status",
      header: "Approval",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.approval.status?.toLowerCase() === "rejected"
              ? "destructive"
              : row.original.approval.status?.toLowerCase() === "accepted"
              ? "default"
              : "outline"
          }
          className="capitalize"
        >
          {row.original.approval.status || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_date",
      header: "Created Date",
      cell: ({ row }) => (
        <p className="w-max">
          {format(new Date(row.original.created_date), "PPp")}
        </p>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const editable = !["accepted", "rejected"].includes(
          row.original.approval.unit_approval.status.toLowerCase()
        );

        return (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => viewRequisition?.(row.original.id)}
              size={"sm"}
              title="Edit Requisition"
              variant={"outline"}
            >
              <EyeIcon className="w-4 h-4" />
              View
            </Button>
            {editable && (
              <Button
                onClick={() => updateRequisition?.(row.original.id)}
                size={"sm"}
                title="View Requisition"
                variant={"secondary"}
              >
                <EditIcon className="w-4 h-4" />
                Edit
              </Button>
            )}

            {row.original.approval.apposable && (
              <Button
                onClick={() => approveRequisition?.(row.original.id)}
                size={"sm"}
              >
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ] as Array<ColumnDef<Requisition>>;
