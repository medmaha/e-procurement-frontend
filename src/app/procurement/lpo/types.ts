interface PurchaseOrder {
	id: ID;
	unique_id: string;
	vendor: {
		id: ID;
		name: string;
	};
	officer: {
		id: ID;
		name: string;
	};
	rfq_response: RFQResponse;
	rfq: RFQ;
	comments: string;
	total_price: number;
	created_date: string;
	last_modified: string;
	approvable: boolean;
	status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED";
}
