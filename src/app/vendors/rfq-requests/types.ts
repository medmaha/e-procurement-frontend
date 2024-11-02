interface RFQRequestItem {
  id: number;
  unique_id: string;
  item_description: string;
  quantity: number;
  measurement_unit: string;
  eval_criteria: string;
  created_date: string; // You might want to use Date type or Moment.js for dates
}

type RFQRequestOfficer = {
  id: ID;
  name: string;
  employee_id: string;
  department: {
    id: ID;
    name: string;
  };
};

interface RFQRequest {
  id: ID;
  vendor: {
    id: ID;
    name: string;
  };
  title: string;
  is_new: boolean;
  open_status: boolean;
  officer: RFQRequestOfficer;
  responded: boolean;
  unique_id: string;
  description: string;
  my_response_id: ID;
  my_response: "pending" | "approved" | "rejected";
  quotation_deadline_date: string;
  items: RFQRequestItem[];
  created_date: string;
  last_modified: string;
}
