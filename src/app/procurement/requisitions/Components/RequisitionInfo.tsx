import React, { useMemo, useState } from "react";
import {
  CalendarIcon,
  BuildingIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BriefcaseIcon,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import Tooltip from "@/Components/ui/tooltip";
import { generate_unique_id } from "@/lib/helpers/generator";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import { formatNumberAsCurrency } from "@/lib/helpers";
import TabularData from "@/Components/widget/TabularData";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/ui/utils";
import { format } from "date-fns";

type Props = {
  user: AuthUser;
  withoutApprovals?: boolean;
  requisition: RequisitionRetrieve;
};

export default function RequisitionInfo({
  user,
  withoutApprovals,
  requisition,
}: Props) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  const itemsColumns = useMemo(() => {
    return requisitionItemColumns(user);
  }, [user]);

  const approvalTimeline = useMemo(() => {
    if (requisition.approvals?.length > 0) return requisition.approvals;

    if (!requisition.current_approval_step) return [];

    return [
      {
        id: 0,
        action: "pending",
        approver: requisition.current_approval_step?.step.approver!,
        created_date: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        comments: "",
        requisition: {
          id: requisition.id.toString(),
          title: generate_unique_id("PR", requisition.id),
        },
        workflow_step: {
          id: requisition.current_approval_step?.step?.id ?? 0,
          order: requisition.current_approval_step?.step?.order ?? 0,
          name: requisition.current_approval_step?.step?.name ?? "",
          status: "active",
          condition: "",
          step: requisition.current_approval_step?.step! as any,
          created_date: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        },
      } satisfies PRApprovalAction,
    ];
  }, [requisition]);

  const getStatusColor = (status: RequisitionApprovalStatus | "pending") => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  return (
    <Card className="bg-transparent border-0 p-0 mb-6 shadow-none">
      <div className="p-0 laptop:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">General Information</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Reference
              </dt>
              <dd className="text-sm">
                {generate_unique_id("PR", requisition.id)}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Request Type
              </dt>
              <dd className="text-sm">{requisition.request_type}</dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Department
              </dt>
              <dd className="text-sm">
                {requisition.officer_department?.name || "N/A"}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Created Date
              </dt>
              <dd className="text-sm flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(requisition.created_date), "MMM dd, yyyy")}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Last Modified
              </dt>
              <dd className="text-sm flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(requisition.last_modified), "PPp")}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Total Amount
              </dt>
              <dd className="text-sm">
                {formatNumberAsCurrency(
                  requisition.items.reduce(
                    (acc, cur) => acc + Number(cur.total_cost),
                    0
                  )
                )}
              </dd>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Requester Information
            </h3>
            <div className="flex items-center mb-4">
              <StaffAvatar
                className="lg:w-10 lg:h-10"
                staff={requisition.officer}
              />
            </div>
            {requisition.officer.unit && (
              <p className="text-sm flex items-center">
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                Unit: {requisition.officer.unit.name}
              </p>
            )}
            {requisition.officer.department && (
              <p className="text-sm flex items-center">
                <BuildingIcon className="mr-2 h-4 w-4" />
                Department: {requisition.officer.department.name}
              </p>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Requisition Items</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            >
              {isItemsExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-2" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-2" />
                  Expand
                </>
              )}
            </Button>
          </div>
          {isItemsExpanded && (
            <TabularData
              plain
              data={requisition.items}
              wrapperClassName={cn(
                "border border-t-none max-h-[350px] min-h-max overflow-hidden overflow-y-auto"
              )}
              rowClassName="divide-x"
              headerClassName="divide-x"
              headerCellClassName="text-sm text-foreground"
              columns={itemsColumns}
            />
          )}
        </div>

        {withoutApprovals !== true && (
          <>
            <Separator className="my-6" />

            {/* Approval Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Approval Timeline</h3>
              {requisition.approvals && approvalTimeline.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {approvalTimeline.map((approval, index) => (
                    <Card
                      key={approval.id.toString()}
                      className="w-full bg-card/40 p-3 relative"
                    >
                      <div className="pb-2 flex items-center gap-2">
                        {approval.approver && (
                          <div className="">
                            <StaffAvatar staff={approval.approver} />
                          </div>
                        )}
                      </div>
                      <div
                        key={approval.id.toString()}
                        className="absolute right-3 top-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            approval.action === "approved"
                              ? "bg-green-100"
                              : approval.action === "rejected"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {getStatusIcon(approval.action)}
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <p className="text-xs text-muted-foreground mb-2 p-0">
                          {new Date(approval.created_date).toLocaleString()}
                        </p>
                        <Badge className={getStatusColor(approval.action)}>
                          {approval.action.charAt(0).toUpperCase() +
                            approval.action.slice(1)}
                        </Badge>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {approval.comments}
                          {!approval.comments &&
                            approval.action === "pending" && (
                              <>
                                Awaiting approval from{" "}
                                <strong>
                                  {approval.workflow_step.step?.approver?.name}
                                </strong>
                              </>
                            )}
                          {!approval.comments &&
                            approval.action !== "pending" && (
                              <>
                                No remarks provided by{" "}
                                <strong>
                                  {approval.workflow_step.step?.approver?.name}
                                </strong>
                              </>
                            )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No approval actions yet.
                </p>
              )}
            </div>

            {requisition.current_approval_step && (
              <>
                <Separator className="mb-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Current Approval Step
                  </h3>
                  <Card className="bg-transparent">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        <span className="mr-2 text-muted-foreground">
                          (
                          {generate_unique_id(
                            "AS",
                            requisition.current_approval_step.id!
                          )}
                          )
                        </span>
                        {requisition.current_approval_step.step.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Step Information
                          </h4>
                          <dl className="grid grid-cols-3 gap-x-2 gap-y-1">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Step Order
                            </dt>
                            <dd className="text-sm col-span-2">
                              {requisition.current_approval_step.step.order}
                            </dd>
                            <dt className="text-sm font-medium text-muted-foreground">
                              Workflow
                            </dt>
                            <dd className="text-sm col-span-2">
                              {requisition.current_approval_step.workflow?.name}
                            </dd>
                            <dt className="text-sm font-medium text-muted-foreground">
                              Workflow Steps
                            </dt>
                            <dd className="text-sm col-span-2">
                              {requisition.current_approval_step.workflow.steps}
                              {requisition.current_approval_step.workflow
                                .steps > 1
                                ? " Steps"
                                : " Step"}
                            </dd>
                          </dl>
                        </div>
                        {requisition.current_approval_step.step.approver && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Approver Information
                            </h4>
                            <div className="flex items-center mb-2">
                              <StaffAvatar
                                className="lg:w-10 lg:h-10"
                                staff={
                                  requisition.current_approval_step.step
                                    .approver
                                }
                              />
                            </div>
                            <dl className="grid grid-cols-3 gap-x-2 mt-2">
                              <dt className="text-sm font-medium text-muted-foreground">
                                Unit
                              </dt>
                              <dd className="col-span-2 text-sm flex items-center">
                                <BriefcaseIcon className="mr-2 h-4 w-4" />
                                {
                                  requisition.current_approval_step.step
                                    .approver.unit?.name
                                }
                              </dd>
                              <dt className="text-sm font-medium text-muted-foreground">
                                Department
                              </dt>
                              <dd className="col-span-2 text-sm flex items-center">
                                <BuildingIcon className="mr-2 h-4 w-4" />
                                {
                                  requisition.current_approval_step.step
                                    .approver.unit?.department?.name
                                }
                              </dd>
                            </dl>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}

        {requisition.remarks && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Remarks</h3>
              <p className="text-muted-foreground">{requisition.remarks}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

const requisitionItemColumns = (
  user: AuthUser
): ColumnDef<RequisitionItem>[] => [
  {
    header: "Reference",
    accessorKey: "id",
    accessorFn: (row) => generate_unique_id("RI", row.id),
  },
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
