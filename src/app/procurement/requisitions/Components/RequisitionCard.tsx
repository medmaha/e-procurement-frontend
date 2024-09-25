import Link from "next/link";
import React from "react";
import { Button } from "@/Components/ui/button";
import { formatNumberAsCurrency } from "@/lib/helpers/transformations";
import Approval from "./Approval";
import EditRequisition from "./EditRequisition";
import ViewRequisitionDetails from "./RequisitionDetails";
import ViewApproval from "./ViewApproval";

type Props = {
  user: AuthUser;
  department: any;
  requisition: Requisition;
};

export default function RequisitionCard({
  user,
  requisition,
  department,
}: Props) {
  return (
    <div
      key={requisition.id}
      className="sm:p-6 p-4 rounded-lg border shadow bg-card text-card-foreground"
    >
      <h3 className="font-semibold text-xl flex justify-between gap-4 flex-wrap">
        <div className="flex items-center pb-1">
          <span className="capitalize">{requisition.items[0].description}</span>
          {requisition.items[1] && (
            <span className="capitalize">
              , {requisition.items[1].description}
            </span>
          )}
          {requisition.items[2] && (
            <span className="text-xs text-muted-foreground px-2 pt-1">
              and {requisition.items.length - 2} more...
            </span>
          )}
        </div>
        <ViewRequisitionDetails user={user} requisition={requisition}>
          <Button
            variant={"link"}
            className="font-semibold underline opacity-80 hover:opacity-100 underline-offset-2 hover:underline-offset-4 transition text-primary text-sm h-max p-1 px-3"
          >
            View
          </Button>
        </ViewRequisitionDetails>
        {/* <ViewRequisition requisition={requisition} /> */}
      </h3>
      <p className="text-muted-foreground text-sm">
        {requisition.remarks || "No remarks was provided for this requisition"}
      </p>
      <div className="pt-6 flex items-center gap-6 flex-wrap justify-between">
        <div className="grid grid-cols-3 w-full gap-2">
          <div className="grid-cols-1">
            <p className="text-xs font-semibold leading-none">
              Average Unit Price
            </p>
            <p className="text-xs text-muted-foreground pt-0.5">
              <span>D{formatNumberAsCurrency(averagePrice(requisition))}</span>
            </p>
          </div>
          <div className="grid-cols-1">
            <p className="text-xs font-semibold leading-none">
              {requisition.items[1] ? "Total Quantity" : "Quantity"}
            </p>
            <p className="text-xs text-muted-foreground pt-0.5">
              <span>
                {!requisition.items[1] ? (
                  <>
                    {requisition.items[0].quantity}{" "}
                    {requisition.items[0].measurement_unit}
                  </>
                ) : (
                  <>
                    {requisition.items.reduce((value, item) => {
                      return value + item.quantity;
                    }, 0)}
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="grid-cols-1">
            <p className="text-xs font-semibold leading-none">Total Price</p>
            <p className="text-xs text-muted-foreground pt-0.5">
              <span>D{formatNumberAsCurrency(totalPrice(requisition))}</span>
            </p>
          </div>
        </div>
        <div className="">
          <p className="text-xs font-semibold leading-none">Authored By</p>
          <p className="text-sm text-muted-foreground hover:text-primary">
            <Link href={"/"}>{requisition.officer?.name}</Link>
          </p>
        </div>
        <div className="flex self-end items-center justify-end gap-4">
          <ViewApproval requisition={requisition} />
          {requisition.approval.editable && (
            <>
              {requisition.changeable && (
                <EditRequisition requisition={requisition} user={user} />
              )}
            </>
          )}
          {requisition.approval.apposable && (
            <div className="pt">
              <Approval
                department={department}
                user={user}
                requisition={requisition}
              >
                <Button size={"sm"} className="">
                  Approve
                </Button>
              </Approval>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const averagePrice = (requisition: Requisition) => {
  let total = 0;
  requisition.items.forEach((item) => {
    if (Number(item.unit_cost) > total) total = Number(item.unit_cost);
  });
  return total;
};

const totalPrice = (requisition: Requisition) => {
  let total = 0;
  requisition.items.forEach((item) => {
    total += Number(item.quantity) * Number(item.unit_cost);
  });
  return total;
};
