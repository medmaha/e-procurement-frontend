"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EditIcon,
  EyeIcon,
  Plus,
  SaveIcon,
  Search,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
  useWorkflowMutation,
  useWorkflowQuery,
} from "../../hooks/useWorkflowQuery";
import { format } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TabularData from "@/Components/widget/TabularData";
import Tooltip from "@/Components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import ActionConfirmation from "@/Components/ActionConfirmation";
import WorkflowDetail from "../../components/WorkflowDetail";
import StatusSelection from "../../components/StatusSelection";
import WorkflowStepCard from "../../components/WorkflowStepCard";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  user: AuthUser;
  state: ApprovalWorkflowStepInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function ApprovalWorkflows(props: Props) {
  const [selectedWorkflow, setSelectedWorkflow] = useState({
    data: null as null | WorkflowInterface,
    mood: "read" as "add" | "read" | "edit" | "trash" | undefined,
  });

  const workflowsQuery = useWorkflowQuery<WorkflowInterface[]>({
    queryKey: ["workflows", props.user.meta?.id],
    url: "/procurement/requisitions/workflows/",
  });

  const columns = useMemo(() => {
    const view = (data: WorkflowInterface) =>
      setSelectedWorkflow({ data, mood: "read" });
    const edit = (data: WorkflowInterface) =>
      setSelectedWorkflow({ data, mood: "edit" });
    const del = (data: WorkflowInterface) =>
      setSelectedWorkflow({ data, mood: "trash" });
    return workflowColumns(view, del, edit);
  }, []);

  return (
    <>
      <div className="space-y-4 my-3">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {" "}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workflows..." className="pl-8" />
          </div>
          <div className="flex items-center gap-4">
            <StatusSelection noColor inserts={["active", "inactive"]} />
            <Button
              onClick={() =>
                setSelectedWorkflow({
                  data: null,
                  mood: "add",
                })
              }
            >
              <Plus className="h-4 w-4" />
              New Workflow{" "}
            </Button>
          </div>
        </div>
      </div>
      <TabularData
        columns={columns}
        data={workflowsQuery.data}
        loading={workflowsQuery.isLoading}
      />

      {selectedWorkflow.mood === "add" && (
        <WorkflowMutationModal
          user={props.user}
          onClose={() => setSelectedWorkflow({} as any)}
        />
      )}
      {selectedWorkflow.data && selectedWorkflow.mood === "edit" && (
        <WorkflowMutationModal
          user={props.user}
          workflow={selectedWorkflow.data}
          onClose={() => setSelectedWorkflow({} as any)}
        />
      )}
      {selectedWorkflow.data && selectedWorkflow.mood === "read" && (
        <WorkflowDetailModal
          user={props.user}
          workflow={selectedWorkflow.data}
          onClose={() => setSelectedWorkflow({} as any)}
        />
      )}
    </>
  );
}

type DetailModalProps = {
  workflow: WorkflowInterface;
  onClose?: any;
  user: AuthUser;
};

function WorkflowDetailModal(props: DetailModalProps) {
  const { data: workflowData } = useWorkflowQuery<WorkflowInterface>({
    url: `/procurement/requisitions/workflows/${props.workflow?.id}/`,
    queryKey: ["workflow", props.user.meta?.id, props.workflow?.id!],
    enabled: !!props.workflow?.id,
  });

  return (
    <Dialog defaultOpen onOpenChange={props.onClose}>
      <DialogContent className="p-0 w-full lg:max-w-[1000px] max-w-[95%]">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Workflow Details</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full max-h-[80svh] p-4 overflow-y-auto overflow-hidden h-full">
          <WorkflowDetail workflow={workflowData || props.workflow} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type MutationModalProps = {
  user: AuthUser;
  onClose?: any;
  workflow?: WorkflowInterface;
};

function WorkflowMutationModal({ workflow, ...props }: MutationModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const workflowMutation = useWorkflowMutation<WorkflowInterface>({
    url: `/procurement/requisitions/workflows/${workflow?.id}/`,
    queryKey: ["workflows", props.user.meta?.id],
    mutationKeys: [["workflow", props.user.meta?.id, workflow?.id!]],
  });

  const { data: workflowData } = useWorkflowQuery<WorkflowInterface>({
    url: `/procurement/requisitions/workflows/${
      workflow ? workflow.id + "/" : ""
    }`,
    queryKey: ["workflow", props.user.meta?.id, workflow?.id!],
    enabled: !!workflow?.id,
  });

  useEffect(() => {
    if (workflowData) {
      setWorkflowSteps(workflowData.workflow_steps);
    }
  }, [workflowData]);

  const [workflowSteps, setWorkflowSteps] = useState<
    ApprovalWorkflowStepInterface[]
  >(workflow?.workflow_steps || []);

  // Query to get the approval-steps from the server
  const approvalStepsQuery = useWorkflowQuery<ApprovalStepInterface[]>({
    queryKey: ["approval-steps", props.user?.meta?.id],
    url: "/procurement/requisitions/workflows/approval-steps/",
  });

  const addWorkFlowStep = () => {
    const mock = {
      status: "active",
      created_date: new Date().toString(),
      order: workflowSteps.length + 1,
    } as any as ApprovalWorkflowStepInterface;
    setWorkflowSteps((prev) => [mock, ...prev]);
  };

  const updateWorkStep = (index: number, key: string, value: any) => {
    if (key === "order") {
      return;
    }

    if (workflowSteps[index]) {
      (workflowSteps[index] as any)[key] = value;
      setWorkflowSteps(workflowSteps);
    }
  };

  async function submitMatrix() {
    try {
      const formData = new FormData(formRef.current!);
      const json = Object.fromEntries(formData.entries()) as any;

      if (workflow) {
        json.mutationMethod = "put";
      }

      json.workflow_steps = workflowSteps;

      const response = await workflowMutation.mutateAsync(json);
      if (!response) {
        alert("Failed to save matrix");
        return false;
      }
      alert("Workflow saved successfully");
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
            {workflow ? "Update" : "Create"} (PR) Approval Workflow
          </DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="block space-y-4 w-full p-4"
        >
          {workflow && (
            <input type="hidden" name="id" defaultValue={workflowData?.id} />
          )}
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input
                name="name"
                placeholder="Give your workflow a name"
                defaultValue={workflowData?.name}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <StatusSelection
                inserts={["active", "inactive"]}
                defaultValue={workflowData?.status}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Matrix Description</Label>
            <Textarea
              placeholder="Write a brief description about the workflow"
              minLength={25}
              maxLength={300}
              defaultValue={workflowData?.description || ""}
              name="description"
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-">Workflow Steps</h4>
              <div className="flex justify-end">
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={addWorkFlowStep}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              {workflowSteps.map((workflowStep, index) => {
                return (
                  <WorkflowStepCard
                    index={index}
                    key={workflowStep.created_date}
                    workflowStep={workflowStep}
                    moveWorkflowStep={() => {}}
                    removeWorkflowStep={() => {}}
                    approvalSteps={approvalStepsQuery.data || []}
                    submitWorkflowSteps={async () => true}
                    updateWorkflowStep={(key, value) =>
                      updateWorkStep(index, key, value)
                    }
                    isLast={index === workflowSteps.length - 1}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end p-2">
            <ActionConfirmation
              showLoadingIcon
              onConfirm={async (closeCB) => {
                const successful = await submitMatrix();
                if (successful) closeCB();
              }}
              title="Confirm Submission"
              description="Are you sure you want to submit this workflow"
              confirmText="Yes Submit"
              cancelText="No Cancel"
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

const workflowColumns = (
  viewWorkflow?: (data: WorkflowInterface) => void,
  trashWorkflow?: (data: WorkflowInterface) => void,
  updateWorkflow?: (data: WorkflowInterface) => void
): ColumnDef<WorkflowInterface>[] => [
  {
    header: "Reference",
    accessorFn: (row) => generate_unique_id("WF", row.id),
  },
  {
    header: "Name",
    accessorFn: (row) => row.name,
  },
  {
    header: "Description",
    accessorFn: (row) => row.description,
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[30ch] text-sm text-muted-foreground">
        {row.original.description || "No description"}
      </p>
    ),
  },
  {
    header: "Steps",
    accessorFn: (row) => {
      const step = row.workflow_steps.length;

      if (step > 1) return `${step} Steps`;

      return `${step} Step`;
    },
  },
  {
    header: "Status",
    accessorFn: (row) => row.status,
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    header: "Last Modified",
    accessorFn: (row) => row.last_modified,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.last_modified), "PPp")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="inline-block w-max">Actions</span>,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Tooltip content="View Workflow">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            className="rounded-full"
            onClick={() => viewWorkflow?.(row.original)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit Workflow">
          <Button
            size={"icon-sm"}
            variant={"secondary"}
            onClick={() => updateWorkflow?.(row.original)}
            className="rounded-full"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete Workflow">
          <Button
            size={"icon-sm"}
            onClick={() => trashWorkflow?.(row.original)}
            variant={"destructive"}
            className="rounded-full"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    ),
  },
];
