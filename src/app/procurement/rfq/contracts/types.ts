interface RFQContract {
	id: ID;
	delivery_terms?: string;
	payment_method?: string;
	validity_period?: string;
	pricing?: number;

	deadline_date?: string;
	terms_and_conditions: string;
	status: "PENDING" | "SUCCESSFUL" | "UNSUCCESSFUL" | "ACTIVE" | "TERMINATED";

	rfq: {
		id: ID;
		name: string;
	};
	supplier: {
		id: ID;
		name: string;
	};
	rfq_response: {
		id: ID;
		name: string;
	};
	officer: {
		id: ID;
		name: string;
	};
	negotiations: any;

	created_date: string;
	last_modified: string;
}

interface RFQNegotiationNote {
	id: ID;
	note: string;
	file?: string;
	pricing: string;
	delivery_terms: string;
	payment_method: string;
	validity_period: string;
	accepted: boolean;
	renegotiated: boolean;

	contract: {
		id: ID;
		name: string;
	};
	author: {
		id: ID;
		name: string;
		profile_type: "Vendor" | "Staff";
	};
	created_date: string;
	last_modified: string;
}

interface RFQContractNegotiation {
	id: ID;
	notes: RFQNegotiationNote[];
	outcome: string;
	status: "PENDING" | "SUCCESSFUL" | "UNSUCCESSFUL";
	can_award?: boolean;
	supplier: {
		id: ID;
		name: string;
	};
	contract: {
		id: ID;
		name: string;
	};
	rfq: {
		id: ID;
		name: string;
	};
	officer: {
		id: ID;
		name: string;
	};
	created_date: string;
	last_modified: string;
}

interface RFQContractAward {
	id: ID;
	remarks?: string | null;
	status: "PENDING" | "AWARDED" | "TERMINATED";
	contract: {
		id: ID;
		name: string;
	};
	vendor: {
		id: ID;
		name: string;
	};
	officer: {
		id: ID;
		name: string;
	};

	created_date: string;
	last_modified: string;
}
