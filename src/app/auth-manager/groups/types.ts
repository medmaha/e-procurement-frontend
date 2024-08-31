export type Group = {
	id: number;
	permissions: Permission[];
	name: string;
	description: string;
	editable: boolean;
	authored_by: string;
	last_modified: string;
};

export type Permission = {
	id: number;
	name: string;
	codename: string;
};
