interface WorkflowApprover {
    id:ID,
    name: string
    avatar?: string
    job_title?:string
    unit?: {
      id:ID,
      name:string
      department?:{
        id:ID,
        name:string
      }
    }
  }

interface ApprovalMatrixInterface {
  id: ID;
  workflow: WorkflowInterface;
  unit?: Unit;
  department?: Department;
  min_amount?: number;
  max_amount?: number;
  created_date: string;
  last_modified: string;
  status?: string;
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
  author?: {
    id: ID;
    name: string;
    avatar?: string;
  };
  status: "active" | "inactive";
  approval_steps?: ApprovalStepInterface[];
  workflow_steps: ApprovalWorkflowStepInterface[];
}

interface ApprovalWorkflowStepInterface {
  id: ID;
  name?: string;
  order: number;
  description?: string;
  step: ApprovalStepInterface;
  workflow?: Partial<WorkflowInterface>;
  author?: {
    id: ID;
    name: string;
    avatar?: string;
    job_title?: string;
  };
  status: "active" | "inactive";
  condition: string | null;
  created_date: string;
  last_modified: string;
}

interface ApprovalStepInterface {
  id: ID;
  order: number;
  name: string;
  role?: string;
  description?: string;
  author?: {
    id: ID;
    name: string;
    avatar?: string;
    job_title?: string;
  };
  approver?: {
    id: ID;
    name: string;
    avatar?: string;
    unit?: Unit;
    job_title?: string;
  };
  is_final: boolean;
  is_optional: boolean;
  department?: Department;
  remarks?: string;
  time_limit?: string;
  created_date: string;
  last_modified: string;
}


interface PRApprovalAction {
  id:ID

  requisition: {
    id:string
    title: string
  }
  approver: WorkflowApprover
  workflow_step: ApprovalWorkflowStepInterface


  action: RequisitionApprovalStatus
  comments?:string
  created_date:string
  last_modified: string

  
}