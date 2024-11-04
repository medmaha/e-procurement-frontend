"use client";

import { useState } from "react";
import { Plus, Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";

import Link from "next/link";

// Interfaces
interface Supplier {
  id: number;
  name: string;
  logo: string;
  short_desc?: string;
}

interface ContractDocument {
  id: number;
  title: string;
  document_url: string;
  uploaded_at: string;
}

interface ContractTermination {
  id: string;
  contract_id: string;
  reason: string;
  terminated_date: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Contract {
  id: string;
  supplier: Supplier;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: "Draft" | "Pending Approval" | "Active" | "Completed" | "Terminated";
  payment_terms: string;
  delivery_schedule: string;
  terms_and_conditions: string;
  confidentiality_clause: boolean;
  penalty_clause: number;
  contract_document_url?: string;
  additional_documents: ContractDocument[];
  approved_by?: User;
  approval_remarks?: string;
  approval_date?: string;
  last_updated: string;
  created_date: string;
  terminations?: ContractTermination[];
}

// Mock data for existing contract drafts
const mockContractDrafts: Contract[] = [
  {
    id: "CD001",
    supplier: {
      id: 1,
      name: "Tech Solutions Inc.",
      logo: "/placeholder.svg?height=40&width=40",
      short_desc: "IT Services Provider",
    },
    title: "Annual IT Support Contract",
    description: "Comprehensive IT support for all company systems",
    start_date: "2023-07-01",
    end_date: "2024-06-30",
    status: "Draft",
    payment_terms: "Monthly payments, Net 30",
    delivery_schedule: "Ongoing support with 24/7 availability",
    terms_and_conditions: "Standard terms apply",
    confidentiality_clause: true,
    penalty_clause: 5000,
    additional_documents: [],
    last_updated: "2023-06-15T10:30:00Z",
    created_date: "2023-06-10T09:00:00Z",
  },
  {
    id: "CD002",
    supplier: {
      id: 2,
      name: "Office Supplies Co.",
      logo: "/placeholder.svg?height=40&width=40",
      short_desc: "Office Equipment Supplier",
    },
    title: "Office Furniture Supply Agreement",
    description: "Supply of ergonomic office furniture",
    start_date: "2023-08-01",
    end_date: "2024-07-31",
    status: "Draft",
    payment_terms: "50% upfront, 50% on delivery",
    delivery_schedule: "Phased delivery over 3 months",
    terms_and_conditions: "Custom terms negotiated",
    confidentiality_clause: false,
    penalty_clause: 2000,
    additional_documents: [],
    last_updated: "2023-06-20T14:45:00Z",
    created_date: "2023-06-18T11:20:00Z",
  },
];

export default function PageContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    status: "Draft",
    confidentiality_clause: false,
    penalty_clause: 0,
    additional_documents: [],
  });

  const toggleExpand = (id: string) => {
    setExpandedDraft(expandedDraft === id ? null : id);
  };

  const filteredDrafts = mockContractDrafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the newContract data to your API
    console.log("New contract draft:", newContract);
    setIsCreateDialogOpen(false);
    // Reset the form
    setNewContract({
      status: "Draft",
      confidentiality_clause: false,
      penalty_clause: 0,
      additional_documents: [],
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contract Drafts</h1>
        <Link href={`/procurement/contracts/drafts/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Draft
          </Button>
        </Link>
      </div>

      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search by contract title or supplier"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <ul className="space-y-4">
        {filteredDrafts.map((draft) => (
          <li key={draft.id} className="border rounded-lg shadow-sm">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleExpand(draft.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={draft.supplier.logo}
                    alt={draft.supplier.name}
                  />
                  <AvatarFallback>
                    {draft.supplier.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{draft.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {draft.supplier.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{draft.status}</Badge>
                <Button variant="ghost" size="sm">
                  {expandedDraft === draft.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </Button>
              </div>
            </div>
            {expandedDraft === draft.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="p-4 bg-accent/50 rounded-b-lg overflow-hidden"
              >
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Start Date
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.start_date}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      End Date
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.end_date}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Payment Terms
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.payment_terms}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Delivery Schedule
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.delivery_schedule}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Confidentiality Clause
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.confidentiality_clause ? "Yes" : "No"}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Penalty Clause
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      ${draft.penalty_clause.toLocaleString()}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {draft.description}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" /> View Full Draft
                  </Button>
                  <Button>Edit Draft</Button>
                </div>
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
