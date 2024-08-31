export interface Unit {
	id: ID;
	unique_id: string;
	name: string;
	description: string;
	disabled: boolean;
	unit_head?: {
		id: number;
		name: string;
		avatar: string;
	};
	created_by?: {
		id: number;
		name: string;
		avatar: string;
	};
	staffs: {
		id: number;
		first_name: string;
		last_name: string;
		name: string;
		job_title: string;
	}[];
	department: {
		id: number;
		name: string;
	};
	created_date: string;
	enabled_since: string;
	last_modified: string;
	phone_number: string;
}
