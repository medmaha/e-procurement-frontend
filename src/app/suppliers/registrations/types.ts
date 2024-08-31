interface VendorRegistration {
	id: ID;
	is_validated: boolean;
	is_email_verified: boolean;
	created_date: string;
	last_modified: string;
	status: "active" | "inactive";
	vendor: {
		id: string;
		name: string;
	};
	contact_person: {
		id: string;
		name: string;
	};
	certificates: {
		id: string;
		name: string;
		file: string;
	}[];
}
