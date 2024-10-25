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
import ActionButton from "@/Components/ActionButton";
import SubmitButton from "@/Components/widget/SubmitButton";

type Props = {
  user: AuthUser;
  workflow_id: string;
};

export default function EditContainer(props: Props) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepInterface[]>(
    []
  );

  const approvalStepsQuery = useWorkflowQuery<ApprovalStepInterface[]>({
    queryKey: ["approval-steps"],
    url: "/procurement/requisitions/workflows/approval-steps/",
  });

  const workflowQuery = useWorkflowQuery<WorkflowInterface>({
    queryKey: ["workflows", props.workflow_id],
    url: `/procurement/requisitions/workflows/${props.workflow_id}/`,
  });

  const workflowMutation = useWorkflowMutation<WorkflowInterface>({
    mutationMethod: "put",
    queryKey: ["workflows"],
    url: "/procurement/requisitions/workflows/",
  });

  useEffect(() => {
    if (workflowQuery.data)
      setWorkflowSteps(workflowQuery.data.workflow_steps || []);
  }, [workflowQuery.data]);

  const moveWorkflowStep = (index: number, direction: "up" | "down") => {
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
    setWorkflowSteps(reorderedSteps);

    // Update workflow steps to reflect the new order
    const updatedWorkflowSteps = workflowSteps.map(
      (workflowStep) =>
        ({
          ...workflowStep,
          step:
            reorderedSteps.find((s) => s.id === workflowStep.step.id) ||
            workflowStep.step,
        } as WorkflowStepInterface)
    );
    setWorkflowSteps(updatedWorkflowSteps);
  };

  const addWorkflowStep = () => {
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

    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const updateWorkflowStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...workflowSteps];
    updatedSteps[index] = { ...workflowSteps[index], [field]: value };
    setWorkflowSteps(updatedSteps);
  };

  const removeWorkflowStep = (index: number) => {
    const updatedSteps = workflowSteps.filter((_, i) => i !== index);
    setWorkflowSteps(updatedSteps);
  };

  const handleSaveWorkflow = async (formData: any) => {
    try {
      const response = await workflowMutation.mutateAsync(formData);
      const message = `Successfully created workflow '0000${response.id}'`;
      alert(message);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form action={handleSaveWorkflow}>
      <Card>
        <CardHeader>
          <CardTitle>Update Workflow</CardTitle>
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
              defaultValue={workflowQuery.data?.name}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={workflowQuery.data?.description || ""}
              placeholder="Enter workflow description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={workflowQuery.data?.status}>
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
          {workflowSteps?.map((step, index) => (
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
          <Button onClick={addWorkflowStep} type="button">
            <Plus className="mr-2 h-4 w-4" /> Add Workflow Step
          </Button>
        </CardContent>
      </Card>

      <Card className="p-0 mt-4">
        <CardFooter className="p-4">
          <SubmitButton className="ml-auto">
            <Save className="mr-2 h-4 w-4" /> Update Workflow
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
