interface Staff {
	id: ID;
	user_id: number;
	employee_id: number;
	name: string;
	bio: string;
	disabled: boolean;
	verified: boolean;
	changeable: boolean;
	job_title: string;

	unit: {
		id: number;
		name: string;
		department: {
			id: number;
			name: string;
		};
	};
	created_at: string;
	created_date: string;
	last_modified: string;
}
