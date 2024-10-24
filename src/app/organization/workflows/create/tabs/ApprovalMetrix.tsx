"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { useWorkflowQuery } from "../../hooks/useWorkflowQuery";

type Props = {
  user: AuthUser;
  state: ApprovalMatrixInterface[];
  updateState: (tab: string, value: any) => void;
};

export default function ApprovalMatrices(props: Props) {
  const approvalMatrixesQuery = useWorkflowQuery<ApprovalMatrixInterface[]>({
    queryKey: ["approval-matrixes"],
    url: "/procurement/requisitions/workflows/matrices/",
  });

  const [approvalMatrices, setApprovalMatrices] = useState<
    ApprovalMatrixInterface[]
  >(props.state);

  useEffect(() => {
    if (approvalMatrixesQuery.data) {
      setApprovalMatrices(approvalMatrixesQuery.data);
    }
  }, [approvalMatrixesQuery.data]);

  const addApprovalMatrix = () => {
    const newMatrix: ApprovalMatrixInterface = {
      id: Date.now().toString(),
      workflow: {} as any,
      created_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
    };
    setApprovalMatrices([...approvalMatrices, newMatrix]);
  };

  const updateApprovalMatrix = (index: number, field: string, value: any) => {
    const updatedMatrices = [...approvalMatrices];
    updatedMatrices[index] = { ...updatedMatrices[index], [field]: value };
    setApprovalMatrices(updatedMatrices);
  };

  const removeApprovalMatrix = (index: number) => {
    const updatedMatrices = approvalMatrices.filter((_, i) => i !== index);
    setApprovalMatrices(updatedMatrices);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Matrix</CardTitle>
        <CardDescription>
          Define approval matrices for the workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvalMatrices?.map((matrix, index) => (
          <Card key={matrix.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Matrix {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeApprovalMatrix(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="Unit"
                value={matrix.unit?.name || ""}
                onChange={(e) =>
                  updateApprovalMatrix(index, "unit", {
                    id: Date.now().toString(),
                    name: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Department"
                value={matrix.department?.name || ""}
                onChange={(e) =>
                  updateApprovalMatrix(index, "department", {
                    id: Date.now().toString(),
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Minimum Amount"
                value={matrix.min_amount || ""}
                onChange={(e) =>
                  updateApprovalMatrix(
                    index,
                    "min_amount",
                    parseFloat(e.target.value)
                  )
                }
              />
              <Input
                type="number"
                placeholder="Maximum Amount"
                value={matrix.max_amount || ""}
                onChange={(e) =>
                  updateApprovalMatrix(
                    index,
                    "max_amount",
                    parseFloat(e.target.value)
                  )
                }
              />
              <Textarea
                placeholder="Description"
                value={matrix.description || ""}
                onChange={(e) =>
                  updateApprovalMatrix(index, "description", e.target.value)
                }
              />
            </CardContent>
          </Card>
        ))}
        <Button onClick={addApprovalMatrix}>
          <Plus className="mr-2 h-4 w-4" /> Add Approval Matrix
        </Button>
      </CardContent>
    </Card>
  );
}
