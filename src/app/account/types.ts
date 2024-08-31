interface Account {
	id: number;
	email: string;
	first_name: string;
	middle_name: string | null;
	last_name: string;
	is_active: boolean;
	profile_type: string;
	created_date: string;
}
