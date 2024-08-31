interface Certificate {
	id: ID;
	name: string;
	type: string;
	achieved_from: string;
	date_achieved: string;
	is_approved: boolean;
	file: string;
	verified: boolean;
	last_modified: string;
	created_date: string;
	vendor: {
		id: ID;
		name: string;
	};
}
