export interface Form101HeaderProps {
	to: string;
	from: string;
	date: string;
	title?: string;
	gppa_code?: string;
	gppaNumber: string;
	signature?: string;
	toLocation: string;
	quotation_no: string;
	fromLocation: string;
	authorizedBy: string;
	office_of_expenses: string;
}

export interface Form101RFQItemsProps extends RequisitionItem {
	remarks?: string;
}

export interface Form101OpenByProps {
	data: { id?: string; name: string; designation: string }[];
}

export type RequisitionIdentifier = {
	user_department: string;
	requisition_number: string;
	date: string;
	location: string;
	date_required: string;
};

export interface Form100Approval extends RequisitionApproval {
	expenditure_head?: string;
}
