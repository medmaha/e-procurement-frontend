interface ApprovalMatrixInterface {
  id: ID;
  workflow: WorkflowInterface;
  unit?: Unit;
  department?: Department;
  min_amount?: number;
  max_amount?: number;
  created_date: string;
  last_modified: string;
  description?: string;
  author?: {
    id: ID;
    name: string;
    avatar?: string;
  };
}
interface WorkflowInterface {
  id: ID;
  name: string;
  created_date: string;
  last_modified: string;
  description?: string;
  officer?: {
    id: ID;
    name: string;
    avatar?: string;
  };
  status: "active" | "inactive";
  approval_steps?: ApprovalStepInterface[];
  workflow_steps: WorkflowStepInterface[];
}

interface WorkflowStepInterface {
  id: ID;
  name: string;
  order: number;
  step: ApprovalStepInterface;
  condition: string | null;
  created_date: string;
  last_modified: string;
}

interface ApprovalStepInterface {
  id: ID;
  order: number;
  name: string;
  role?: string;
  officer?: {
    id: ID;
    name: string;
    avatar?: string;
  };
  is_final: boolean;
  is_optional: boolean;
  department?: Department;
  remarks?: string;
  time_limit?: string;
  created_date: string;
  last_modified: string;
}
