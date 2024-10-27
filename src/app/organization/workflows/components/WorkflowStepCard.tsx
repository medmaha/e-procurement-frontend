"use client";

import { Edit, Save, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import StatusSelection from "./StatusSelection";

type Props = {
  index: number;
  isLast: boolean;
  workflowStep: ApprovalWorkflowStepInterface;
  approvalSteps: ApprovalStepInterface[];
  removeWorkflowStep: (index: number) => void;
  submitWorkflowSteps: (data: any) => Promise<boolean>;
  updateWorkflowStep: (field: string, value: any) => void;
  moveWorkflowStep: (index: number, direction: "up" | "down") => void;
};

export default function WorkflowStepCard({
  workflowStep,
  index,
  ...props
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"edit" | "view" | "create">(() => {
    if (workflowStep.last_modified) return "view";
    return "create";
  });

  // FIXME: This hack does not function as expected, due to the select boxes
  // FIXME: I'm facing challenges margin the actual click-event to the step-card

  // useEffect(() => {
  //   function handleOutsideClick(ev: any) {
  //     if (cardRef.current && !cardRef.current.contains(ev.target)) {
  //       setMode("view");
  //     }
  //   }

  //   document.addEventListener("click", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [mode]);

  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    if (workflowStep.last_modified) {
      // A HACK TO PREVENT THE FORM FROM BEING SUBMITTED AS A POST REQUEST
      data.mutationMethod = "put";
    }
    const success = await props.submitWorkflowSteps(data);
    if (success) {
      setMode("view");
    }
  }

  function toggleEditMode() {
    const _mode = mode === "edit" ? "view" : "edit";
    setMode(_mode);
  }

  return (
    <Card
      key={workflowStep.id}
      ref={cardRef}
      className="tablet:p-0 bg-card/50 focus-within:border-primary/30 transition-[border] duration-200"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
        <CardTitle className="text-sm font-medium">
          Step {workflowStep.order}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => props.removeWorkflowStep(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5 p-4">
        <div className="grid space-y-2.5 sm:space-y-0 sm:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Ordering</Label>
              <Input
                type="number"
                placeholder="Step order"
                defaultValue={workflowStep.order.toString()}
                onChange={(e) =>
                  props.updateWorkflowStep("order", e.target.value)
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <StatusSelection
                inserts={["active", "inactive"]}
                placeholder="Step status"
                defaultValue={workflowStep.status || "active"}
                onChange={(value) => props.updateWorkflowStep("status", value)}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Approval Step</Label>
            <Select
              defaultValue={workflowStep.step?.id?.toString()}
              onValueChange={(value) => props.updateWorkflowStep("step", value)}
            >
              <SelectTrigger>
                <SelectValue
                  className="placeholder:text-muted-foreground"
                  placeholder="Select workflow step"
                />
              </SelectTrigger>
              <SelectContent>
                {props.approvalSteps?.map((approvalSteps) => (
                  <SelectItem
                    key={approvalSteps.id}
                    value={approvalSteps.id?.toString()}
                  >
                    {approvalSteps.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="sm:flex justify-between items-end gap-8">
          <div className="grid gap-1.5 flex-1">
            <Label>Condition</Label>
            <Input
              placeholder="eg: if the total amount is greater than 1000"
              defaultValue={workflowStep.condition || ""}
              className="w-full"
              onChange={(e) =>
                props.updateWorkflowStep("condition_type", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
