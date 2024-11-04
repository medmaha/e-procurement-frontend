interface ContractAward {
  id: ID;
  status: "PENDING" | "AWARDED" | "REJECTED";
  remarks: string;
  created_date: string;
  last_modified: string;
  officer: {
    id: ID;
    name: string;
    job_title: string;
    avatar: string;
  };
  quotation: {
    id: ID;
    rfq_id: ID;
    pricing: string;
    created_date: string;
    delivery_date: string;
    evaluation_status: string;
    vendor: {
      id: number;
      logo: string | null;
      name: string;
      short_desc: string | null;
    };
  };
  approval?: {
    id: ID;
    officer: {
      id: ID;
      name: string;
      job_title: string;
      avatar: string;
    };
    remarks: string;
    approve: "pending" | "approved" | "rejected";
    created_date: string;
    last_modified: string;
  };
  contract?: {
    id: ID;
    number: string;
    created_date: string;
  };
}
