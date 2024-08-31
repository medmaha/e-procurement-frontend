interface Threshold {
	id: ID;
	min_amount: string;
	max_amount: string;
	description: string;
	gppa_requirement: boolean;
	procurement_method: string;
}

interface PlanItem {
	id: ID;
	description: string;
	quantity: number | null;
	budget: string;
	measurement_unit: string;
	procurement_method: string;
	quarter_1_budget: string;
	quarter_2_budget: string;
	quarter_3_budget: string;
	quarter_4_budget: string;
	created_date: string;
	last_modified: string;
}

interface DepartmentProcurementPlan {
	id: ID;
	department: Department | null;
	description: string | null;
	created_date: string;
	last_modified: string;
	items: PlanItem[];
}

interface AnnualPlan {
	id: ID;
	title: string | null;
	description: string | null;
	department_plans: DepartmentProcurementPlan[];
	year_start: string;
	renewed_year: string | null;
	officer: Staff | null;
	org_approved: boolean;
	gppa_approved: boolean;
	is_operational: boolean;
	is_current_plan: boolean;
	latest_approval_request_date: string | null;
	created_date: string;
	last_modified: string;
	items: PlanItem[];
	name?:string

	request_for_approval_org: boolean;
	request_for_approval_gppa: boolean;
	request_for_approval_both: boolean;
}

interface AnnualProcurementPlanApproval {
	id: ID;
	officer: Staff | null;
	annual_plan: AnnualPlan;
	approved: boolean;
	remarks: string | null;
	created_date: string;
	last_modified: string;
}

interface AnnualProcurementPlanApprovalGPPA {
	id: ID;
	officer: GPPAUser | null;
	annual_plan: AnnualPlan;
	approved: boolean;
	remarks: string | null;
	created_date: string;
	last_modified: string;
}

interface Staff {
	// Define Staff interface if not already defined
}

interface GPPAUser {
	// Define GPPAUser interface if not already defined
}
