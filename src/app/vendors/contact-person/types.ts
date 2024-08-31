interface ContactPerson {
	id: ID;
	unique_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	name: string;
	address: Address;
	created_date: string;
	verified: boolean;
	last_modified: string;
	vendor: {
		id: ID;
		name: string;
	};
}
