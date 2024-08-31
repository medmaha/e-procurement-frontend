interface Vendor {
	id: ID;
	active: boolean;
	organization_name: string;
	description: string;
	industry: string;
	website: string;
	tin_number: number;
	vat_number: number;
	license_number: number;
	logo: string;
	slug: string;
	address: Address;
	contact_person: ContactPerson;
	user_account: ContactPerson;
	certificates: Certificate[];
	registration_type: string;
	registration_number: number;
	established_date: string;
	verified: boolean;
	unique_id: string;
	created_date: string;
	last_modified: string;
}
