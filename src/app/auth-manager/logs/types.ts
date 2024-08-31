interface LogEntry {
	id: ID;
	action: {
		message: string;
		type: "ADDITION" | "UPDATE" | "DELETION" | "NORMAL";
	};
	user: {
		id: string;
		email: string;
		name: string;
	};
	object: {
		id: string;
		name: string;
	};
	date: string;
}

// create a dummy log data
export const logEntries: LogEntry[] = [
	{
		id: "1",
		action: {
			message: "Created a new staff",
			type: "ADDITION",
		},
		user: {
			id: "user1",
			email: "user1@example.com",
			name: "John Doe",
		},
		object: {
			id: "S000014",
			name: "Staff",
		},
		date: "2024-01-03T08:00:00Z",
	},
	{
		id: "5",
		action: {
			message: "Changed email address",
			type: "UPDATE",
		},
		user: {
			id: "user5",
			email: "user5@example.com",
			name: "Gimmy Wallace",
		},
		object: {
			id: "AC000100",
			name: "Account",
		},
		date: "2024-01-01T11:45:00Z",
	},
	{
		id: "2",
		action: {
			message: "Updated a requisition item",
			type: "UPDATE",
		},
		user: {
			id: "user2",
			email: "user2@example.com",
			name: "Jane Smith",
		},
		object: {
			id: "R0001024",
			name: "Requisition",
		},
		date: "2024-01-03T09:30:00Z",
	},
	{
		id: "3",
		action: {
			message: "Logged out of the portal",
			type: "NORMAL",
		},
		user: {
			id: "user4",
			email: "user4@example.com",
			name: "Alice Johnson",
		},
		object: {
			id: "AC000110",
			name: "Account",
		},
		date: "2024-01-03T11:45:00Z",
	},
	{
		id: "4",
		action: {
			message: "Deletes an authorization group",
			type: "DELETION",
		},
		user: {
			id: "user3",
			email: "user3@example.com",
			name: "Alice Johnson",
		},
		object: {
			id: "GR000140",
			name: "Auth Group",
		},
		date: "2024-01-03T11:45:00Z",
	},

	// Add more entries as needed
];
