interface Group {
	id: ID;
	name: string;
	authored_by: string;
	description: string;
	created_date: string;
	permissions: number;
}

interface Unit {
	id: ID;
	name: string;
	department: Department;
}

interface StaffProfile {
	id: ID;
	employee_id: string;
	job_title: string;
	name: string;
	email: string;
	phone: string;
	gender: string;
	biography: string;
	disabled: boolean;
	created_date: string;
	last_modified: string;
	is_self: boolean;
	is_admin: boolean;
	groups: Group[];
	unit: Unit;
	profile_type: "Staff";
}

interface VendorProfile {
	id: ID;
	name: string;
	email: string;
	phone: string;
	description: string;
	profile_type: "Vendor";
}
