"use client";

import {
  Plus,
  Search,
  EditIcon,
  EyeIcon,
  Trash2Icon,
  SaveIcon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  useWorkflowMutation,
  useWorkflowQuery,
} from "../../hooks/useWorkflowQuery";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import StatusSelection from "../../components/StatusSelection";
import { generate_unique_id } from "@/lib/helpers/generator";
import Tooltip from "@/Components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import StaffsSelect from "@/Components/widget/StaffsSelect";
import { Label } from "@/Components/ui/label";
import DepartmentSelection from "@/Components/widget/DepartmentsSelect";
import { Switch } from "@/Components/ui/switch";
import ActionConfirmation from "@/Components/ActionConfirmation";
import ApprovalStepDetail from "../../components/ApprovalStepDetail";
type Props = {
  user: AuthUser;
  state: ApprovalStepInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function ApprovalSteps({ user, state }: Props) {
  const [selectedApprovalStep, setSelectedApprovalStep] = useState({
    data: null as null | ApprovalStepInterface,
    mood: "read" as "add" | "read" | "edit" | "trash" | undefined,
  });

  const columns = useMemo(() => {
    const view = (data: ApprovalStepInterface) =>
      setSelectedApprovalStep({ data, mood: "read" });
    const edit = (data: ApprovalStepInterface) =>
      setSelectedApprovalStep({ data, mood: "edit" });
    const del = (data: ApprovalStepInterface) =>
      setSelectedApprovalStep({ data, mood: "trash" });
    return approvalStepColumn(view, del, edit);
  }, []);

  // Query to get the approval-steps from the server
  const approvalStepsQuery = useWorkflowQuery<ApprovalStepInterface[]>({
    queryKey: ["approval-steps", user?.meta?.id],
    url: "/procurement/requisitions/workflows/approval-steps/",
  });

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
                setSelectedApprovalStep({
                  mood: "add",
                  data: null,
                });
              }}
            >
              <Plus className="h-4 w-4" />
              New Step
            </Button>
          </div>
        </div>
      </div>

      {selectedApprovalStep.mood === "read" && selectedApprovalStep.data && (
        <ApprovalStepDetailModal
          user={user}
          step={selectedApprovalStep.data}
          onClose={() =>
            setSelectedApprovalStep({ data: null, mood: undefined })
          }
        />
      )}

      {(selectedApprovalStep.mood === "add" ||
        selectedApprovalStep.mood === "edit") && (
        <ApprovalStepMutationModal
          user={user}
          step={selectedApprovalStep.data || undefined}
          onClose={() =>
            setSelectedApprovalStep({ data: null, mood: undefined })
          }
        />
      )}

      <TabularData
        columns={columns}
        data={approvalStepsQuery.data}
        loading={approvalStepsQuery.isLoading}
      />
    </>
  );
}

type ApprovalStepModalProps = {
  user: AuthUser;
  onClose?: any;
  step: ApprovalStepInterface;
};

function ApprovalStepDetailModal(props: ApprovalStepModalProps) {
  const { data: stepData } = useWorkflowQuery<ApprovalStepInterface>({
    url: `/procurement/requisitions/workflows/approval-steps/${props.step?.id}/`,
    queryKey: ["approval-steps", props.user.meta?.id, props.step?.id!],
    enabled: !!props.step?.id,
  });

  return (
    <Dialog defaultOpen onOpenChange={props.onClose}>
      <DialogContent className="p-0 w-full lg:max-w-[1000px] max-w-[95%]">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Approval Step Details</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full max-h-[80svh] p-4 overflow-y-auto overflow-hidden h-full">
          <ApprovalStepDetail step={stepData || props.step} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type MutationModalProps = {
  user: AuthUser;
  onClose?: any;
  step?: ApprovalStepInterface;
};

function ApprovalStepMutationModal({ step, ...props }: MutationModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const approvalStepMutation = useWorkflowMutation<ApprovalStepInterface>({
    url: "/procurement/requisitions/workflows/approval-steps/",
    queryKey: ["approval-steps", props.user.meta?.id],
  });

  const { data: stepData } = useWorkflowQuery<ApprovalStepInterface>({
    url: `/procurement/requisitions/workflows/approval-steps/${step?.id}/`,
    queryKey: ["approval-steps", props.user.meta?.id, step?.id!],
    enabled: !!step?.id,
  });

  async function submitApprovalStep() {
    try {
      const formData = new FormData(formRef.current!);
      const json = Object.fromEntries(formData.entries()) as any;

      if (step) {
        json.mutationMethod = "put";
      }

      const response = await approvalStepMutation.mutateAsync(json);
      if (!response) {
        alert("Failed to save approval step");
        return false;
      }
      alert("Approval-Step saved successfully");
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
            {step ? "Update" : "Create"} (PR) Approval Step
          </DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 w-full p-4 min-h-[60svh]"
        >
          {step && (
            <>
              <input type="hidden" name="id" defaultValue={step?.id} />
              <input type="hidden" name="order" defaultValue={step?.order} />
            </>
          )}

          <div className="space-y-4 w-full flex-1">
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="name">Name</Label>

                <Input
                  autoFocus
                  id="name"
                  name="name"
                  placeholder="Step name"
                  defaultValue={step?.name}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label htmlFor="role">Role</Label>

                <Input
                  id="role"
                  name="role"
                  placeholder="Role"
                  defaultValue={step?.role}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label htmlFor="department_id">Department</Label>
                <DepartmentSelection
                  id="department_id"
                  name="department"
                  triggerClassName="step-card-select"
                  placeholder="Select department"
                  defaultValue={step?.department?.id.toString()}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label htmlFor="approver_id">Approver</Label>
                <StaffsSelect
                  id="approver_id"
                  name="approver"
                  triggerClassName="step-card-select"
                  placeholder="Select approver (optional)"
                  // defaultValue={step?.approver?.id.toString()}
                />
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`is_optional`}
                      name={`is_optional`}
                      className="disabled:pointer-events-none"
                      defaultChecked={step?.is_optional}
                    />
                    <Label htmlFor={`is_optional`}>Optional Step</Label>
                  </div>
                  <p className="text-muted-foreground">
                    <small>Optional steps can be skipped if necessary</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <ActionConfirmation
              showLoadingIcon
              onConfirm={async (closeCB) => {
                const successful = await submitApprovalStep();
                if (successful) closeCB();
              }}
              title="Confirm Submission"
              description="Are you sure you want to submit this approval step"
              confirmText="Yes Submit"
              cancelText="No Cancel"
            >
              <Button type="button">
                <SaveIcon />
                Save Approval Step
              </Button>
            </ActionConfirmation>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const approvalStepColumn = (
  viewStep?: (data: ApprovalStepInterface) => void,
  trashStep?: (data: ApprovalStepInterface) => void,
  updateStep?: (data: ApprovalStepInterface) => void
): ColumnDef<ApprovalStepInterface>[] => [
  {
    header: "Reference",
    accessorFn: (row) => generate_unique_id("AS", row.id),
  },
  {
    header: "Step Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <p className="line-clamp-2 max-w-[20ch">{row.original.name}</p>;
    },
  },
  {
    header: "Department",
    accessorKey: "department.id",
    cell: ({ row }) => {
      return (
        <p className="line-clamp-2 max-w-[20ch">
          {row.original.department?.name || "N/A"}
        </p>
      );
    },
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Approver",
    accessorKey: "approver.id",
    cell: ({ row }) => {
      if (!row.original.approver) return "N/A";
      return (
        <div className="inline-flex items-center gap-1">
          <Avatar className="w-8 h-8">
            <AvatarImage src={row.original.approver?.avatar} />
            <AvatarFallback>
              {row.original.approver?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="inline-grid">
            <span>{row.original.approver?.name}</span>
            <span className="text-muted-foreground">
              <small>{row.original.approver?.job_title}</small>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Last Modified",
    accessorKey: "last_modified",
    cell: ({ row }) => {
      return (
        <p className="w-max">
          {row.original.last_modified &&
            format(new Date(row.original.last_modified), "PPp")}
        </p>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Tooltip content="View Step">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            className="rounded-full"
            onClick={() => viewStep?.(row.original)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit Step">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            onClick={() => updateStep?.(row.original)}
            className="rounded-full"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete Step">
          <Button
            size={"icon-sm"}
            onClick={() => trashStep?.(row.original)}
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
