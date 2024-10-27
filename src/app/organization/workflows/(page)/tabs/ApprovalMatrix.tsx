"use client";

import { useMemo, useRef, useState } from "react";
import {
  Plus,
  SaveIcon,
  Search,
  Trash2Icon,
  EditIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

import {
  useWorkflowMutation,
  useWorkflowQuery,
} from "../../hooks/useWorkflowQuery";

import DepartmentSelection from "@/Components/widget/DepartmentsSelect";
import UnitsSelect from "@/Components/widget/UnitsSelect";
import { Label } from "@/Components/ui/label";
import WorkflowSelection from "@/Components/widget/WorkflowSelection";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Dialog, DialogContent, DialogHeader } from "@/Components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";
import { formatNumberAsCurrency } from "@/lib/helpers";
import StatusSelection from "../../components/StatusSelection";
import MatrixDetails from "../../components/MatrixDetail";
import Tooltip from "@/Components/ui/tooltip";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  user: AuthUser;
  state: ApprovalMatrixInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function ApprovalMatrices(props: Props) {
  const [selectedMatrix, setSelectedMatrix] = useState({
    data: null as null | ApprovalMatrixInterface,
    mood: "read" as "add" | "read" | "edit" | "trash" | undefined,
  });

  const approvalMatrixesQuery = useWorkflowQuery<ApprovalMatrixInterface[]>({
    queryKey: ["approval-matrixes", props.user?.meta?.id],
    url: "/procurement/requisitions/workflows/matrices/",
  });

  const columns = useMemo(() => {
    const view = (data: ApprovalMatrixInterface) =>
      setSelectedMatrix({ data, mood: "read" });
    const edit = (data: ApprovalMatrixInterface) =>
      setSelectedMatrix({ data, mood: "edit" });
    const del = (data: ApprovalMatrixInterface) =>
      setSelectedMatrix({ data, mood: "trash" });
    return matrixColumns(view, del, edit);
  }, []);

  return (
    <>
      <div className="space-y-4 my-3">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search matrices..." className="pl-8" />
          </div>
          <div className="flex items-center gap-4">
            <StatusSelection
              noColor
              inserts={["all-statuses", "active", "inactive"]}
            />
            <Button
              onClick={() => {
                setSelectedMatrix({ data: null, mood: "add" });
              }}
            >
              <Plus className="h-4 w-4" />
              New Matrix
            </Button>
          </div>
        </div>
      </div>

      <TabularData
        columns={columns}
        loading={approvalMatrixesQuery.isLoading}
        emptyMessage="No matrices found"
        data={approvalMatrixesQuery.data || []}
      />

      {selectedMatrix.data && selectedMatrix.mood === "read" && (
        <MatrixDetailModal
          user={props.user}
          matrix={selectedMatrix.data}
          onClose={() => {
            setSelectedMatrix({ data: null, mood: undefined });
          }}
        />
      )}
      {selectedMatrix.mood === "add" && (
        <MatrixMutationModal
          user={props.user}
          onClose={() => {
            setSelectedMatrix({ data: null, mood: undefined });
          }}
        />
      )}
      {selectedMatrix.data && selectedMatrix.mood === "edit" && (
        <MatrixMutationModal
          user={props.user}
          matrix={selectedMatrix.data}
          onClose={() => {
            setSelectedMatrix({ data: null, mood: undefined });
          }}
        />
      )}
    </>
  );
}

type MutationModalProps = {
  user: AuthUser;
  onClose?: () => void;
  matrix?: ApprovalMatrixInterface;
};

function MatrixMutationModal({ ...props }: MutationModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const approvalMatrixMutation = useWorkflowMutation<ApprovalMatrixInterface>({
    url: `/procurement/requisitions/workflows/matrices/${
      props.matrix ? props.matrix.id + "/" : ""
    }`,
    queryKey: ["approval-matrixes", props.user.meta?.id],
  });

  const { data: matrixData } = useWorkflowQuery<ApprovalMatrixInterface>({
    url: `/procurement/requisitions/workflows/matrices/${props.matrix?.id}/`,
    queryKey: ["approval-matrix", props.user.meta?.id, props.matrix?.id!],
    enabled: !!props.matrix?.id,
  });

  async function submitMatrix() {
    try {
      const formData = new FormData(formRef.current!);
      const json: any = Object.fromEntries(formData.entries());

      if (props.matrix) json.mutationMethod = "put";

      const response = await approvalMatrixMutation.mutateAsync(json);
      if (!response) {
        alert("Failed to save matrix");
        return false;
      }
      alert("Matrix saved successfully");
      props.onClose?.();
      return true;
    } catch (error: any) {
      alert(error.message);
      return false;
    }
  }

  return (
    <Dialog defaultOpen onOpenChange={props.onClose}>
      <DialogContent className="p-0 max-w-[95%] max-h-[95vh] overflow-y-auto lg:max-w-[800px] xl:max-w-[1000px]">
        <DialogHeader className="border-b p-4">
          <DialogTitle>
            {matrixData ? "Edit" : "Create"} Approval Matrix
          </DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="block space-y-4 w-full p-4"
        >
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="grid gap-1.5">
              <Label>Unit</Label>
              <UnitsSelect
                name="unit"
                authUserId={props.user?.meta?.id}
                placeholder="(Optional)"
                defaultValue={matrixData?.unit?.id?.toString()}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Department</Label>
              <DepartmentSelection
                name="department"
                authUserId={props.user?.meta?.id}
                placeholder="(Optional)"
                defaultValue={matrixData?.department?.id?.toString()}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Minimum Amount</Label>
              <Input
                type="number"
                placeholder="Minimum Amount"
                defaultValue={matrixData?.min_amount}
                name="min_amount"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Maximum Amount</Label>
              <Input
                type="number"
                placeholder="Maximum Amount"
                name="max_amount"
                defaultValue={matrixData?.max_amount}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Workflow</Label>
              <WorkflowSelection
                name="workflow"
                authUserId={props.user?.meta?.id}
                defaultValue={matrixData?.workflow?.id?.toString()}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Created By</Label>
              <p className="p-2 text-sm rounded-md border bg-background">
                <span className="text-muted-foreground mr-1">(You)</span>{" "}
                {props.user.name}
              </p>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Matrix Description</Label>
            <Textarea
              placeholder="Write a brief description about the matrix"
              minLength={25}
              maxLength={300}
              defaultValue={matrixData?.description || ""}
              name="description"
            />
          </div>
          <div className="flex justify-end p-2">
            <ActionConfirmation
              showLoadingIcon
              onConfirm={async (closeCB) => {
                const successful = await submitMatrix();
                if (successful) closeCB();
              }}
              title="Confirm Submission"
              description="Are you sure you want to submit this matrix?"
              confirmText="Submit"
              cancelText="Cancel"
            >
              <Button type="button">
                <SaveIcon />
                Save WorkFlow
              </Button>
            </ActionConfirmation>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type MatrixDetailModalProps = {
  user: AuthUser;
  matrix: ApprovalMatrixInterface;
  onClose?: () => void;
};

function MatrixDetailModal(props: MatrixDetailModalProps) {
  const { data: matrixData } = useWorkflowQuery<ApprovalMatrixInterface>({
    url: `/procurement/requisitions/workflows/matrices/${props.matrix?.id}/`,
    queryKey: ["approval-matrix", props.user.meta?.id, props.matrix?.id!],
    enabled: !!props.matrix?.id,
  });

  return (
    <Dialog defaultOpen onOpenChange={props.onClose}>
      <DialogContent className="p-0 w-full lg:max-w-[1000px] max-w-[95%]">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Approval Matrix Details</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full max-h-[80svh] p-4 overflow-y-auto overflow-hidden h-full">
          <MatrixDetails
            user={props.user}
            matrix={matrixData || props.matrix}
            loading={matrixData === undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const matrixColumns = (
  viewMatrix?: (data: ApprovalMatrixInterface) => void,
  trashMatrix?: (data: ApprovalMatrixInterface) => void,
  updateMatrix?: (data: ApprovalMatrixInterface) => void
): ColumnDef<ApprovalMatrixInterface>[] => [
  {
    header: "Reference",
    accessorFn: (row) => generate_unique_id("MX", row.id),
  },
  {
    header: "Workflow Name",
    accessorFn: (row) => row.workflow.name,
  },
  {
    header: "Unit",
    accessorFn: (row) => row.unit?.name || "N/A",
  },
  {
    header: "Department",
    accessorFn: (row) => row.department?.name || "N/A",
  },
  {
    header: "Min Amount",
    accessorFn: (row) =>
      row.min_amount ? formatNumberAsCurrency(row.min_amount) : "Infinite",
  },
  {
    header: "Max Amount",
    accessorFn: (row) =>
      row.max_amount ? formatNumberAsCurrency(row.max_amount) : "Infinite",
  },
  {
    header: "Status",
    accessorFn: (row) => row.workflow.status,
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.original.workflow.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.workflow.status || "Inactive"}
      </span>
    ),
  },
  {
    header: "Last Modified",
    accessorFn: (row) => format(new Date(row.last_modified), "PPp"),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Tooltip content="View Workflow">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            className="rounded-full"
            onClick={() => viewMatrix?.(row.original)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit Workflow">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            onClick={() => updateMatrix?.(row.original)}
            className="rounded-full"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete Workflow">
          <Button
            size={"icon-sm"}
            onClick={() => trashMatrix?.(row.original)}
            variant={"destructive"}
            title="Delete Workflow"
            className="rounded-full"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    ),
  },
];
