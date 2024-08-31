interface RFQInterface {
	id: ID;
	officer: {
		id: ID;
		name: string;
	};
	title: string;
	unique_id: string;
	level: RFQ["level"];
	open_status: boolean;
	approval_status: RFQ["approval_status"];
	deadline: string;
	approved_status: "PROCESSING" | "ACCEPTED" | "REJECTED";
	created_date: string;
}

interface RFQResponse {
	id: ID;
	unique_id: string;
	remarks: string;
	status: "PENDING" | "ACCEPTED" | "REJECTED";
	deadline: string;
	approved_status: "PROCESSING" | "ACCEPTED" | "REJECTED";
	items: RFQItem[];
	apposable: boolean;
	proforma: string;
	form101?: string;
	invited_at: string;
	rfq: RFQInterface;
	created_date: string;
	last_modified: string;
	vendor: {
		id: ID;
		name: string;
	};
	brochures: {
		id: ID;
		name: string;
		file: string;
	}[];
	delivery_terms: string;
	payment_method?: string;
	pricing: number;
	validity_period: string;
	evaluation?: QuoteEvaluation[];
	approved_date?: string;
	approved_remarks?: string;
	approved_officer?: {
		id: string;
		name: string;
	};
}

interface QuoteEvaluation {
	id: ID;
	item_id: ID;
	rating: number;
	comments: string;
	status: "pending" | "submitted" | "rejected";
	pricing: string | number;
	specifications: boolean;
	quantity: number;
	officer: {
		id: ID;
		name: string;
	};
}
