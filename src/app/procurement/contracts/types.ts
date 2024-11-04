// Supplier Interface
interface Supplier {
  id: number;
  name: string;
  logo?: string;
  short_desc?: string;
}

interface Officer {
  id: ID;
  name: string;
  avatar?: string;
  job_title?: string;
}

// ContractDocument Interface
interface ContractAttachment {
  id: ID;
  name: string;
  document_url: string; // URL or file path to access the document
  uploaded_at: string; // ISO date string for the upload date
}

interface Quotation {
  id: ID;
  rfq_id: ID;
  delivery_date: string;
  created_date: string;
  pricing: number;
  evaluation_status: "AWARDED" | "PENDING" | "REJECTED";
  vendor: Vendor;
}

interface Contract {
  id: ID;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  status: "Draft" | "Pending Approval" | "Active" | "Completed" | "Terminated";

  award?: ID;
  payment_terms: string;
  delivery_schedule: string;
  terms_and_conditions: string;
  confidentiality_clause: boolean;
  penalty_clause?: number;

  approval_status: "approved" | "pending" | "rejected";
  approval_date?: string;
  approval_remarks?: string;
  terminated_reason?: string;
  terminated_date?: string;

  created_date: string;
  last_updated: string;

  approved_by?: Officer;
  terminated_by?: Officer;

  attachments: ContractAttachment[];

  supplier: Supplier;
  officer: Officer;
  quotation: Quotation | null;
}
