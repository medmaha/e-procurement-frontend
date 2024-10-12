type ID = number | string;
type NumberOrString = number | string;

type Json = {
  [x: string]: any;
};

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type PageProps = {
  params: Json;
  searchParams: Json;
};

interface Address {
  town: string;
  district: string;
  region: string;
  country: string;
  string: string;
}

interface AuthUser {
  name: string;
  profile_id: number;
  profile_type: "Staff" | "Vendor" | "Superuser" | "GPPA";
  meta: {
    id: ID;
    vendor?: {
      id: ID;
      name: string;
      industry: string;
      is_validated: boolean;
      is_completed: boolean;
    };
  };
}

interface AuthPerm {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
}
