"use client";
import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { retrieveRequisition } from "../actions";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";

type MainProps = {
  user: AuthUser;
  children?: ReactNode;
  defaultOpen?: boolean;
  onClose?: () => void;
  requisition: Requisition;
};

export default function ViewRequisitionDetails(props: MainProps) {
  const { user, children } = props;
  const [isOpen, setIsOpen] = useState(props.defaultOpen || false);

  const requisitionQuery = useQuery({
    enabled: isOpen,
    staleTime: Infinity,
    queryKey: ["requisition", props.requisition.id],
    queryFn: async () => {
      const response = await retrieveRequisition(String(props.requisition.id));
      if (response.success) {
        return response.data as Requisition;
      }
      throw response;
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setIsOpen(opened);
        if (!opened) {
          props.onClose && props.onClose();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isOpen && (
        <DialogContent className="max-w-[95svw] mx-auto p-0">
          <DialogHeader className="h-max py-2 px-6 border-b flex justify-between w-full">
            <DialogTitle className="text-xl sm:text-2xl capitalize">
              Requisition Details
            </DialogTitle>
            <DialogDescription className="pb-0 mb-0">
              <p className="text-sm text-muted-foreground">
                View the details of the requisition {requisitionQuery.data?.id}
              </p>
            </DialogDescription>
            {/* <div className="w-full text-right flex items-center justify-end gap-4">
              <Link
                href={"/procurement/requisitions/" + requisitionQuery.data?.id}
                className="p-1 px-2 h-max transition font-semibold underline-offset-4 hover:outline-muted-foreground outline-2 outline-transparent outline rounded-xl hover:underline text-sm text-muted-foreground hover:text-secondary-foreground bg-secondary "
              >
                More Details
              </Link>
              <Link
                href={"/form-101?m=requisition&i=" + requisitionQuery.data?.id}
                className="p-1 px-2 h-max font-semibold text-sm opacity:70 bg-sky-500 rounded hover:bg-sky-600 transition text-black"
              >
                PDF File
              </Link>
            </div> */}
          </DialogHeader>
          <div className="max-h-[60dvh] min-h-[30dvh] px-6 flex-1">
            <RequisitionDetails user={user} data={requisitionQuery.data} />
          </div>
          {/* <div className="flex items-center gap-2 justify-center h-full pb-8">
						<p className="text-xl">Approval:</p>
						<div className="text-xl inline-flex items-start gap-2 pl-4">
							{requisitionQuery.data?.approval.status == "pending" ? (
								<Loader2
									className={`text-accent-foreground animate-spin duration-1000`}
								/>
							) : requisitionQuery.data?.approval.status == "rejected" ? (
								<X className="text-destructive" />
							) : (
								<Check className="text-primary" />
							)}

							<p className="text-muted-foreground capitalize">
								{requisitionQuery.data?.approval.status}
							</p>
						</div>
					</div> */}
          <div className="py-4 flex flex-wrap justify-between items-center gap-6 mt-2 px-6">
            <div className="grid gap-1">
              <p className="text-lg font-bold">Approval Status</p>
              <p className="capitalize opacity-60 inline-flex items-center gap-1">
                <span className="pt-0.5 inline-block">
                  {requisitionQuery.data?.approval.status.toLowerCase() ==
                  "pending" ? (
                    <Loader2
                      size={"16"}
                      className={`text-accent-foreground animate-spin`}
                    />
                  ) : requisitionQuery.data?.approval.status.toLowerCase() ==
                    "rejected" ? (
                    <X size={"16"} className="text-destructive" />
                  ) : (
                    <Check size={"16"} className="text-primary" />
                  )}
                </span>
                <span className="opacity-60">
                  {requisitionQuery.data?.approval.status}
                </span>
              </p>
            </div>
            {requisitionQuery.data?.approval.status.toLowerCase() ===
              "pending" && (
              <div className="grid gap-1">
                <p className="text-lg font-bold">Approval Stage</p>
                <p className="capitalize opacity-60 inline-flex items-center gap-1">
                  <span>
                    {requisitionQuery.data?.approval.stage}
                    {["procurement", "finance"].includes(
                      requisitionQuery.data?.approval.stage.toLowerCase()
                    )
                      ? " Department "
                      : " "}
                    Approval
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

const CACHE = new Map();

type Props = {
  user: AuthUser;
  data?: Requisition;
};

export function RequisitionDetails({ user, data, ...props }: Props) {
  return (
    <div className="block w-full">
      <div className="flex items-center flex-wrap sm:grid gap-4 sm:grid-cols-4 grid-cols-2 w-full pt-4">
        <div className="grid">
          <p className="text-sm font-semibold leading-none">Requisition ID</p>
          <p className="text-xs text-muted-foreground pt-0.5 truncate">
            {data?.unique_id}
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
          <p className="text-sm font-semibold leading-none">Total Amount</p>
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
          <p className="text-sm font-semibold leading-none">Date Issued</p>
          <p
            title={data?.created_date}
            className="text-xs text-muted-foreground pt-0.5 truncate"
          >
            {data?.created_date && format(new Date(data?.created_date), "PPp")}
          </p>
        </div>
        <div className="grid">
          <p className="text-sm font-semibold leading-none">Last Modified</p>
          <p
            title={data?.created_date}
            className="text-xs text-muted-foreground pt-0.5 truncate"
          >
            {data?.created_date && format(new Date(data?.last_modified), "PPp")}
          </p>
        </div>
        <div className="grid">
          <p className="text-sm font-semibold leading-none">Request Type</p>
          <p
            title={data?.request_type}
            className="text-xs text-muted-foreground pt-0.5 truncate"
          >
            {data?.request_type || "N/A"}
          </p>
        </div>
      </div>
      {/* Itens */}
      <div className="pt-4">
        <h4 className="font-semibold">
          Requirements
          <small className="text-muted-foreground px-4">
            Total Items: {data?.items?.length}
          </small>
        </h4>
        <TabularData
          user={user}
          data={data?.items || []}
          columns={requisitionItemColumns}
          tableName="Requisition Requirements"
        />
      </div>
    </div>
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
