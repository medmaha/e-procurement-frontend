"use client";

import { Plus, Trash2, MoveUp, MoveDown, Save, Edit } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { useWorkflowQuery } from "../../hooks/useWorkflowQuery";
import { useEffect, useState } from "react";
import StaffsSelect from "@/Components/widget/StaffsSelect";
import SubmitButton from "@/Components/widget/SubmitButton";
import Tooltip from "@/Components/ui/tooltip";

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

  useEffect(() => {
    if (approvalStepsQuery.data) {
      setApprovalSteps(approvalStepsQuery.data);
    }
  }, [approvalStepsQuery.data]);

  const addApprovalStep = () => {
    const order = approvalSteps.length + 1;
    const stepName = `Approval Step ${order}`;
    const newStep: ApprovalStepInterface = {
      order,
      name: stepName,
      id: Date.now().toString(),
      is_final: false,
      is_optional: false,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
    };
    setApprovalSteps([...(approvalSteps || []), newStep]);
  };

  const updateApprovalStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...(approvalStepsQuery.data || [])];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setApprovalSteps(updatedSteps);
  };

  const removeApprovalStep = (index: number) => {
    const updatedSteps = approvalSteps.filter((_, i) => i !== index);
    reorderApprovalSteps(updatedSteps);
  };

  const moveApprovalStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === approvalSteps.length - 1)
    ) {
      return;
    }

    const step = approvalSteps[index];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    approvalSteps[index] = approvalSteps[swapIndex];
    approvalSteps[swapIndex] = step;

    reorderApprovalSteps(approvalSteps);
  };

  const reorderApprovalSteps = (steps: ApprovalStepInterface[]) => {
    const reorderedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    setApprovalSteps(reorderedSteps);
  };

  return (
    <>
      <Card className="">
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap justify-between">
            <div className="">
              <CardTitle>Approval Steps</CardTitle>
              <CardDescription>
                Define and order the steps for approval
              </CardDescription>
            </div>
            <Button type="button" onClick={addApprovalStep}>
              <Plus className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {approvalSteps.map((step, index) => (
            <Card key={step.id} className="p-0">
              <CardHeader className="p-2 px-4 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Step {step.order}
                </CardTitle>
                <div className="flex space-x-2">
                  <Tooltip content="Move Up">
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon-sm"
                      onClick={() => moveApprovalStep(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Move Down">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      type="button"
                      onClick={() => moveApprovalStep(index, "down")}
                      disabled={
                        index === (approvalStepsQuery.data?.length || 0) - 1
                      }
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Edit Step">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      type="button"
                      // onClick={() => removeApprovalStep(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete Step">
                    <Button
                      className="text-destructive/80 hover:text-destructive"
                      variant="ghost"
                      size="icon-sm"
                      type="button"
                      onClick={() => removeApprovalStep(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-2 px-4">
                <form action="" className="space-y-2 w-full block">
                  <Input
                    name="name"
                    placeholder="Step name"
                    defaultValue={step.name}
                  />
                  <Input
                    name="role"
                    placeholder="Role"
                    defaultValue={step.role || ""}
                  />
                  <StaffsSelect
                    name="approver_id"
                    defaultValue={step.approver?.id}
                  />
                  <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div className="space-y-2">
                      {/* <div className="flex items-center space-x-2">
                        <Switch
                          name={`final-${step.id}`}
                          id={`final-${step.id}`}
                          defaultChecked={step.is_final}
                        />
                        <Label htmlFor={`final-${step.id}`}>Final Step</Label>
                      </div> */}
                      <div className="">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`optional-${step.id}`}
                            name={`optional-${step.id}`}
                            defaultChecked={step.is_optional}
                          />
                          <Label htmlFor={`optional-${step.id}`}>
                            Optional Step
                          </Label>
                        </div>
                        <p className="text-muted-foreground">
                          <small>
                            Optional steps can be skipped if necessary
                          </small>
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <SubmitButton className="">
                        <Save className="mr-1 h-4 w-4" /> Save Changes
                      </SubmitButton>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
