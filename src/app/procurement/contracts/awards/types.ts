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
    delivery_date: string;
    created_date: string;
    evaluation_status: string;
    pricing: string;
    vendor: {
      id: number;
      logo: string | null;
      name: string;
      short_desc: string | null;
    };
  };
}
