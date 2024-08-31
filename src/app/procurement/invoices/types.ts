interface Invoice {
	id: ID;
	purchase_order: PurchaseOrder;
	status: "pending" | "paid" | "late" | "cancelled";
	amount: number;
	tax_amount: number;
	total_amount: number;
	notes: string;
	due_date: string;
	payment_terms: "net_30" | "net_60" | "net_90" | "due_on_receipt" | "custom";

	created_date: string;
	last_modified: string;
	vendor: {
		id: ID;
		name: string;
	};
}
