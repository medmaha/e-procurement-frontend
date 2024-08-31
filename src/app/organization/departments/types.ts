interface Department {
	id: number;
	name: string;
	description: string;
	disabled: boolean;
	phone: string;
	email: string;
	units: { id: ID; name: string }[];
	department_head?: {
		id: number;
		name: string;
		avatar: string;
	};
	staffs?: {
		id: number;
		name: string;
		avatar: string;
		unit: {
			id: ID;
			name: string;
		};
		job_title: string;
		disabled: boolean;
	}[];
	created_by?: {
		id: number;
		name: string;
		avatar: string;
	};
	created_date: string;
	last_modified: string;
}
