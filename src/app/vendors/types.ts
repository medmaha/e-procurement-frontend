interface QuotationOfficer {
	id: number;
	name: string;
	department: string;
}

interface QuotationItem {
	id: ID;
	item_description: string;
	quantity: number;
	measurement_unit: string;
	eval_criteria: string;
	unit_price?: string;
	total_price?: string;
	remarks?: string;
}
interface Quotation {
	id: ID;
	is_new: boolean;
	rfq_id: ID;
	rfq: {
		id: ID;
		unique_id: string;
		deadline: string;
	};
	unique_id: string;
	title: string;
	deadline: string;
	status: "PENDING" | "ACCEPTED" | "REJECTED";
	officer: QuotationOfficer;
	items: QuotationItem[];
	responded: boolean;
	created_date: string;
}
interface QuotationResponse {
	id: ID;
	unique_id: string;
	quotation_id: string;
	status?: "PENDING" | "ACCEPTED" | "REJECTED";
	evaluation_status: "PENDING" | "ACCEPTED" | "REJECTED";
	officer: QuotationOfficer;
	items: QuotationItem[];
	remarks: string;
	proforma: string;
	created_date: string;
}
