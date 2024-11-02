"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { generate_unique_id } from "@/lib/helpers/generator";
import { format } from "date-fns";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import ContractAwardApproval from "./Component/ApproveAward";

type Props = {
  user: AuthUser;
  data: ContractAward[];
  permissions: AuthPerm;
};

export default function PageContainer({ data, permissions, user }: Props) {
  const [expandedAward, setExpandedAward] = useState<ID | null>(null);
  const [selectedAward, setSelectedAward] = useState<ContractAward>();
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: ID) => {
    setExpandedAward(expandedAward === id ? null : id);
  };

  const filteredAwards = data.filter(
    (award) =>
      award.officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.quotation.vendor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {selectedAward && (
        <ContractAwardApproval
          user={user}
          onClose={() => {
            setSelectedAward(undefined);
            setExpandedAward(null);
          }}
          award={selectedAward}
          autoOpen={true}
        />
      )}
      <div className="container mx-auto">
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search by vendor or officer name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
        </div>
        <ul className="space-y-4">
          {filteredAwards.map((award) => (
            <li key={award.id} className="border rounded-lg shadow-sm">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleExpand(award.id)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={award.quotation.vendor.logo || undefined}
                      alt={award.quotation.vendor.name}
                    />
                    <AvatarFallback>
                      {award.quotation.vendor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">
                      {award.quotation.vendor.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {award.quotation.vendor.short_desc}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(award.created_date), "PPp")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {award.status === "PENDING" && permissions.approve && (
                    <Button
                      size={"sm"}
                      variant={
                        expandedAward === award.id ? "outline" : "default"
                      }
                    >
                      Approve
                    </Button>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      award.status === "AWARDED"
                        ? "bg-success/10 text-success"
                        : award.status === "REJECTED"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {award.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    {expandedAward === award.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </Button>
                </div>
              </div>
              {expandedAward === award.id && (
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
                        Reference
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {generate_unique_id("AWD", award.id)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Created Date
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {format(new Date(award.created_date), "PPp")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Last Modified
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {format(new Date(award.last_modified), "PPp")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Remarks
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {award.remarks}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Quotation ID
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {generate_unique_id("QR", award.quotation.id)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        RFQ ID
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {generate_unique_id("RFQ", award.quotation.rfq_id)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Delivery Date
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        {format(new Date(award.quotation.delivery_date), "PPp")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            award.status === "AWARDED"
                              ? "bg-success/10 text-success"
                              : award.status === "REJECTED"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {award.status}
                        </span>
                      </dd>
                    </div>
                    <div className="">
                      <dt className="text-sm font-medium text-accent-foreground/80">
                        Procurement Officer
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground flex items-center">
                        <StaffAvatar staff={award.officer} />
                      </dd>
                    </div>
                    {award.status === "PENDING" && permissions.approve && (
                      <div className="">
                        <dt className="text-sm font-medium text-accent-foreground/80">
                          Approve
                        </dt>
                        <dd className="mt-1 text-sm text-muted-foreground flex items-center">
                          <Button
                            autoFocus
                            size={"sm"}
                            onClick={() => setSelectedAward(award)}
                          >
                            Approve
                          </Button>
                        </dd>
                      </div>
                    )}
                  </dl>
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
