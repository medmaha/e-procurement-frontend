interface SystemUsers {
	id: ID;
	email: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	profile_type: "Staff" | "Vendor" | "Admin";
	is_active: boolean;
	last_login: string;
	created_date: string;
}
