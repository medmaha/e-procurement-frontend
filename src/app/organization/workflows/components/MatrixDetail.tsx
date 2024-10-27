import React from "react";
import { CalendarIcon, DollarSign, Building, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";
import { formatNumberAsCurrency } from "@/lib/helpers";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import { generate_unique_id } from "@/lib/helpers/generator";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";

type Props = {
  user: AuthUser;
  loading?: boolean;
  matrix: ApprovalMatrixInterface;
};
export default function MatrixDetails({ matrix, loading }: Props) {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <p className="text-muted-foreground">
          {matrix.description || "No description provided."}
        </p>
        <Badge variant={matrix.status === "active" ? "default" : "destructive"}>
          {matrix.status || "Invalid"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <dl className="grid grid-cols-2 lg:grid-cols-[18ch_1fr] gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-muted-foreground">
              Reference
            </dt>
            <dd>{generate_unique_id("MX", matrix.id)}</dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Last Modified
            </dt>
            <dd className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {matrix.last_modified &&
                format(new Date(matrix.last_modified), "PPp")}
            </dd>
            {matrix.unit && (
              <>
                <dt className="text-sm font-medium text-muted-foreground">
                  Unit
                </dt>
                <dd className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  {matrix.unit.name}
                </dd>
              </>
            )}
            {matrix.department && (
              <>
                <dt className="text-sm font-medium text-muted-foreground">
                  Department
                </dt>
                <dd className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  {matrix.department.name}
                </dd>
              </>
            )}
            <dt className="text-sm font-medium text-muted-foreground">
              Min Amount
            </dt>
            <dd className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              {matrix.min_amount
                ? formatNumberAsCurrency(matrix.min_amount)
                : "Not specified"}
            </dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Max Amount
            </dt>
            <dd className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              {matrix.max_amount
                ? formatNumberAsCurrency(matrix.max_amount)
                : "Not specified"}
            </dd>
          </dl>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Workflow Information</h2>
          <dl className="grid grid-cols-2 lg:grid-cols-[18ch_1fr] gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-muted-foreground">
              Workflow Name
            </dt>
            <dd title={matrix.workflow.name} className="truncate">
              {matrix.workflow.name}
            </dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Reference
            </dt>
            <dd>{generate_unique_id("WF", matrix.workflow.id)}</dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Workflow Created
            </dt>
            <dd className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {matrix.workflow.created_date &&
                format(new Date(matrix.workflow.created_date), "PPP")}
            </dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Workflow Modified
            </dt>
            <dd className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {matrix.workflow.last_modified &&
                format(new Date(matrix.workflow.last_modified), "PPp")}
            </dd>
          </dl>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="md:text-xl text-lg font-semibold mb-4">
          Workflow Steps
        </h2>
        <TabularData
          plain
          loading={loading}
          columns={workflowStepColumn}
          data={matrix.workflow.workflow_steps}
        />
        {matrix.workflow.workflow_steps &&
          matrix.workflow.workflow_steps.length < 1 && (
            <div className="flex justify-center items-center h-24">
              <p className="text-muted-foreground">No workflow steps found.</p>
            </div>
          )}
      </div>

      {matrix.author && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-xl font-semibold mb-4">Author Information</h2>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage
                  src={matrix.author.avatar}
                  alt={matrix.author.name}
                />
                <AvatarFallback>{matrix.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{matrix.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  Author ID: {matrix.author.id.toString()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const workflowStepColumn: ColumnDef<ApprovalWorkflowStepInterface>[] = [
  {
    header: "Reference",
    accessorKey: "id",
    cell: ({ row }) => generate_unique_id("WS", row.original.id),
  },
  {
    header: "Step Reference",
    accessorKey: "step.id",
    cell: ({ row }) => generate_unique_id("AS", row.original.step.id),
  },
  {
    header: "Step Name",
    accessorKey: "step.name",
  },
  {
    header: "Step Role",
    accessorKey: "step.role",
  },
  {
    header: "Approver",
    accessorKey: "step.approver.id",
    cell: ({ row }) => {
      return <StaffAvatar staff={row.original.step.approver} />;
    },
  },
  {
    header: "Order",
    accessorKey: "order",
  },
  {
    header: "Created Date",
    accessorKey: "step.created_date",
    cell: ({ row }) => format(new Date(row.original.step.created_date), "PPP"),
  },
];
