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
	office_expenses: string;
	deadline: string;
	rfq_id: string;
	isRFQ: boolean;
}

export interface Form101RFQItemsProps {
	data: {
		id: ID;
		item_description: string;
		quantity: number | string;
		measurement_unit: string;
		eval_criteria: string;
		unit_price: number | null;
		total_price: number | null;
		remarks: string;
	}[];
}

export interface Form101OpenByProps {
	suppliers?: {
		id: ID;
		name: string;
		location: string;
	}[];
	data: { id?: string; name: string; designation: string }[];
}
