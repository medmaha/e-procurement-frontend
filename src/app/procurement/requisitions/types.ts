type RequisitionApprovalStatus = "pending" | "approved" | "rejected";

interface RequisitionItem {
  id: number;
  description: string;
  quantity: number;
  unit_cost: string;
  total_cost: string;
  measurement_unit: string;
  remark?: string;
  is_valid?: boolean;
  created_date: string;
  last_modified: string;
}

interface Requisition {
  id: ID;
  unique_id: string;
  request_type: string;
  items: RequisitionItem[];
  changeable: boolean;
  officer: {
    id: number;
    name: string;
    unit?: {
      id: number;
      name: string;
    };
    department?: {
      id: number;
      name: string;
    };
  };
  officer_department?: {
    id: number;
    name: string;
  };
  remarks: string;
  created_date: string;
  last_modified: string;
  current_approver?: {
    id: ID;
    name: string;
  };
  approval_status: RequisitionApprovalStatus;
}

interface RequisitionRetrieve extends Requisition {
  approvals: PRApprovalAction[];
  current_approval_step: CurrentApprovalStep | null;
}

interface CurrentApprovalStep {
  id: number;
  order: number;
  step: {
    id: number;
    order: number;
    name: string;
    approver: WorkflowApprover | null;
  };
  workflow: { id: number; name: string; steps: number };
}
