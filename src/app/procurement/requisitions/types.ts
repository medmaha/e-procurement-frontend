//

interface InnerRequisitionApproval {
	status: ApprovalStatus;
	id: null | number;
}

interface FinanceApproval extends InnerRequisitionApproval {
	funds_confirmed: true;
	expenditure_head?: {
		id: string;
		name: string;
	};
}
interface ProcurementApproval extends InnerRequisitionApproval {
	part_of_annual_plan: boolean;
	annual_procurement_plan: {
		id: string;
		title: string;
	};
}

interface RequisitionApproval {
	id: number;
	editable: boolean;
	status: ApprovalStatus;
	unit_approval: InnerRequisitionApproval;
	department_approval: InnerRequisitionApproval;
	finance_approval: FinanceApproval;
	procurement_approval: ProcurementApproval;
	procurement_method: string;
	apposable: boolean;
	total_sum: string | number;
	stage: "Unit" | "Department" | "Procurement" | "Finance";
	created_date: string;
	last_modified: string;
}

interface RequisitionItem {
	id: number;
	description: string;
	quantity: number;
	unit_cost: string;
	total_cost: string;
	measurement_unit: string;
	created_date: string;
	last_modified: string;
}

interface Requisition {
	id: number;
	unique_id: string;
	request_type: string;
	items: RequisitionItem[];
	changeable: boolean;
	officer: {
		id: number;
		name: string;
		unit: {
			id: number;
			name: string;
		};
		department: {
			id: number;
			name: string;
		};
	};
	approval_status: ApprovalStatus;
	remarks: string;
	approval: RequisitionApproval;
	created_date: string;
	last_modified: string;
}
