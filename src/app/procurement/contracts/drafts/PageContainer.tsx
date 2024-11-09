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
interface Props {
  user: AuthUser;
  permissions: AuthPerm;
  contracts: Contract[];
}

export default function PageContainer(props: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    status: "Draft",
    confidentiality_clause: false,
    penalty_clause: 0,
    attachments: [],
  });

  const toggleExpand = (id: string) => {
    setExpandedDraft(expandedDraft === id ? null : id);
  };

  const filteredDrafts = props.contracts.filter(
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
      attachments: [],
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
              onClick={() => toggleExpand(draft.id.toString())}
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
                      ${draft.penalty_clause?.toLocaleString() || "N/A"}
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
                  <Link href={`/contracts/drafts/${draft.id}`}>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" /> View Full Draft
                    </Button>
                  </Link>
                  [props.user.profile_id === draft.office.id &&
                  <Link href={`/contracts/drafts/${draft.id}?edit=true`}>
                    <Button>Edit Draft</Button>
                  </Link>
                  ]
                </div>
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
