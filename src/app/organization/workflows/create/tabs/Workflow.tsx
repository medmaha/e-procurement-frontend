"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
  useWorkflowMutation,
  useWorkflowQuery,
} from "../../hooks/useWorkflowQuery";

type Props = {
  user: AuthUser;
  state: WorkflowStepInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function WorkflowCreator(props: Props) {
  const [workflow, setWorkflow] = useState<WorkflowInterface>(
    {} as WorkflowInterface
  );

  const approvalStepsQuery = useWorkflowQuery<ApprovalStepInterface[]>({
    queryKey: ["approval-steps"],
    url: "/procurement/requisitions/workflows/approval-steps/",
  });

  const workflowMutation = useWorkflowMutation<WorkflowInterface>({
    mutationMethod: "post",
    queryKey: ["workflow"],
    url: "/procurement/requisitions/workflows/",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setWorkflow({ ...workflow, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setWorkflow({ ...workflow, status: value as "active" | "inactive" });
  };

  const moveWorkflowStep = (index: number, direction: "up" | "down") => {
    const workflowSteps = workflow.workflow_steps || [];
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === workflowSteps.length - 1)
    ) {
      return;
    }

    const updatedSteps = workflowSteps;
    const step = updatedSteps[index];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    updatedSteps[index] = updatedSteps[swapIndex];
    updatedSteps[swapIndex] = step;

    reorderWorkflowSteps(updatedSteps);
  };

  const reorderWorkflowSteps = (steps: WorkflowStepInterface[]) => {
    const reorderedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    setWorkflow({ ...workflow, workflow_steps: reorderedSteps });

    // Update workflow steps to reflect the new order
    const updatedWorkflowSteps = workflow.workflow_steps.map(
      (workflowStep) =>
        ({
          ...workflowStep,
          step:
            reorderedSteps.find((s) => s.id === workflowStep.step.id) ||
            workflowStep.step,
        } as WorkflowStepInterface)
    );
    setWorkflow({
      ...workflow,
      workflow_steps: updatedWorkflowSteps,
    });
  };

  const addWorkflowStep = () => {
    const workflowSteps = workflow?.workflow_steps || [];
    const workflowStepOrder = workflowSteps.length + 1;
    const workflowStepName = "New Workflow Step " + workflowStepOrder;

    const newStep: WorkflowStepInterface = {
      id: Date.now().toString(),
      name: workflowStepName,
      order: workflowStepOrder,
      step: {} as any,
      condition: null,
      created_date: new Date().toISOString(),
      last_modified: "",
    };

    setWorkflow({
      ...workflow,
      workflow_steps: [...workflowSteps, newStep],
    });
  };

  const updateWorkflowStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...workflow.workflow_steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setWorkflow({ ...workflow, workflow_steps: updatedSteps });
  };

  const removeWorkflowStep = (index: number) => {
    const updatedSteps = workflow.workflow_steps.filter((_, i) => i !== index);
    setWorkflow({ ...workflow, workflow_steps: updatedSteps });
  };

  const handleSaveWorkflow = async () => {
    try {
      const response = await workflowMutation.mutateAsync(workflow);
      const message = `Successfully created workflow '0000${response.id}'`;
      alert(message);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create Workflow</CardTitle>
          <CardDescription>
            Set up a new purchase-request approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              name="name"
              value={workflow.name}
              onChange={handleInputChange}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={workflow.description || ""}
              onChange={handleInputChange}
              placeholder="Enter workflow description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={handleStatusChange}
              defaultValue={workflow.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
          <CardDescription>Define the workflow process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflow.workflow_steps?.map((step, index) => (
            <Card key={step.id} className="tablet:p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
                <CardTitle className="text-sm font-medium">
                  Step {step.order}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkflowStep(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2.5 p-4">
                <div className="grid gap-1.5">
                  <Label>Step Name</Label>
                  <Input
                    placeholder="Step name"
                    value={step.name}
                    onChange={(e) =>
                      updateWorkflowStep(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Approval Step</Label>
                  <Select
                    onValueChange={(value) =>
                      updateWorkflowStep(
                        index,
                        "step",
                        approvalStepsQuery.data?.find(
                          (s) => s.id.toString() === value
                        )
                      )
                    }
                    defaultValue={step.step?.id?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval step" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvalStepsQuery.data?.map((approvalStep) => (
                        <SelectItem
                          key={approvalStep.id}
                          value={approvalStep.id?.toString()}
                        >
                          {approvalStep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Condition</Label>
                  <Input
                    placeholder="eg: if the total amount is greater than 1000"
                    value={step.condition || ""}
                    className="w-full"
                    onChange={(e) =>
                      updateWorkflowStep(index, "condition", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addWorkflowStep}>
            <Plus className="mr-2 h-4 w-4" /> Add Workflow Step
          </Button>
        </CardContent>
      </Card>

      <Card className="p-0 mt-4">
        <CardFooter className="p-4">
          <Button className="ml-auto" onClick={handleSaveWorkflow}>
            <Save className="mr-2 h-4 w-4" /> Save Workflow
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
