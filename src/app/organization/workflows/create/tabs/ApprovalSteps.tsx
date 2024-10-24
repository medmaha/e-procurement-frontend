"use client";

import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { useWorkflowQuery } from "../../hooks/useWorkflowQuery";
import { useState } from "react";

type Props = {
  user: AuthUser;
  state: ApprovalStepInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function ApprovalSteps({ user }: Props) {
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStepInterface[]>(
    []
  );

  const approvalStepsQuery = useWorkflowQuery<ApprovalStepInterface[]>({
    queryKey: ["approval-steps"],
    url: "/procurement/requisitions/workflows/approval-steps/",
  });

  const addApprovalStep = () => {
    const order = (approvalStepsQuery.data?.length || 0) + 1;
    const stepName = `New Approval Step - ${order}`;
    const newStep: ApprovalStepInterface = {
      order,
      name: stepName,
      id: Date.now().toString(),
      is_final: false,
      is_optional: false,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
    };
    setApprovalSteps([...(approvalStepsQuery.data || []), newStep]);
  };

  const updateApprovalStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...(approvalStepsQuery.data || [])];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    // setApprovalSteps(updatedSteps);
  };

  const removeApprovalStep = (index: number) => {
    // const updatedSteps = approvalSteps.filter((_, i) => i !== index);
    // reorderApprovalSteps(updatedSteps);
  };

  const moveApprovalStep = (index: number, direction: "up" | "down") => {
    const { data = [] } = approvalStepsQuery;

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const updatedSteps = [...data];
    const step = updatedSteps[index];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    updatedSteps[index] = updatedSteps[swapIndex];
    updatedSteps[swapIndex] = step;

    // reorderApprovalSteps(updatedSteps);
  };

  const reorderApprovalSteps = (steps: ApprovalStepInterface[]) => {
    const reorderedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    // setApprovalSteps(reorderedSteps);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Approval Steps</CardTitle>
        <CardDescription>
          Define and order the steps for approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvalStepsQuery.data?.map((step, index) => (
          <Card key={step.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Step {step.order}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveApprovalStep(index, "up")}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveApprovalStep(index, "down")}
                  disabled={
                    index === (approvalStepsQuery.data?.length || 0) - 1
                  }
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeApprovalStep(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="Step name"
                value={step.name}
                onChange={(e) =>
                  updateApprovalStep(index, "name", e.target.value)
                }
              />
              <Input
                placeholder="Role"
                value={step.role || ""}
                onChange={(e) =>
                  updateApprovalStep(index, "role", e.target.value)
                }
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id={`final-${step.id}`}
                  checked={step.is_final}
                  onCheckedChange={(checked) =>
                    updateApprovalStep(index, "is_final", checked)
                  }
                />
                <Label htmlFor={`final-${step.id}`}>Final Step</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`optional-${step.id}`}
                  checked={step.is_optional}
                  onCheckedChange={(checked) =>
                    updateApprovalStep(index, "is_optional", checked)
                  }
                />
                <Label htmlFor={`optional-${step.id}`}>Optional Step</Label>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addApprovalStep}>
          <Plus className="mr-2 h-4 w-4" /> Add Approval Step
        </Button>
      </CardContent>
    </Card>
  );
}
