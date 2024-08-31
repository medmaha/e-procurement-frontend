interface RFQItem {
	id: number;
	unique_id: string;
	item_description: string;
	quantity: number;
	measurement_unit: string;
	eval_criteria: string;
	created_date: string; // You might want to use Date type or Moment.js for dates
}

type RFQOfficer = {
	id: ID;
	name: string;
	employee_id: string;
	department: {
		id: ID;
		name: string;
	};
};

type RFQ = {
	id: ID;
	officer: RFQOfficer;
	requisition: {
		id: ID;
		title: string;
		unique_id: string;
	};
	title: string;
	unique_id: string;
	terms_and_conditions: string;
	description: string;
	status: string;
	approval_status: string;
	open_status: boolean;
	deadline: string;
	level:
		| "APPROVAL LEVEL"
		| "QUOTATION LEVEL"
		| "EVALUATION LEVEL"
		| "CONTRACT LEVEL"
		| "EVALUATION LEVEL";
	published: boolean;
	auto_publish: boolean;
	items: RFQItem[];
	//
	editable: boolean;
	approvable: boolean;
	publishable: boolean;
	suppliers: RFQOfficer[];
	created_date: string;
	last_modified: string;
};
