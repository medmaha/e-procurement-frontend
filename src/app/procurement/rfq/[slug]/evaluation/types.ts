interface RFQEvaluation {
	rfq: {
		id: ID;
		unique_id: string;
	};
	officer: {
		id: ID;
		name: string;
	};

	specifications: boolean;
	pricing: number | string;
	quantity: number;
	rating: number;
	status: boolean;
	comments: string;

	created_date: string;
	last_modified: string;
}

interface RFQEvaluationRecord {
	id: ID;
	quotation: {
		id: ID;
		submitted_date: string;
		vendor: {
			id: ID;
			name: string;
		};
	};
	officer: {
		id: ID;
		name: string;
	};
	item: {
		id: ID;
		name: string;
	};
	specifications: boolean;
	pricing: number | string;
	quantity: number;
	rating: number;
	status: boolean;
	comments: string;
	rfq_id: string;
	rfq_response_id: string;
	created_date: string;
	last_modified: string;
}

interface WinnerCriteria {
	average_pricing: number;
	average_rating: number;
	total_specs: number;
}

interface Winners {
	[vendorName: string]: {
		evaluations: RFQEvaluation[];
		winner_criteria: WinnerCriteria;

		total_pricing: number;
		total_rating: number;
		total_specs: number;

		rfq_id: ID;
		rfq_response_id: ID;
	};
}
