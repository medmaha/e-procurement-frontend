"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search, Download } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { motion } from "framer-motion";
import { generate_unique_id } from "@/lib/helpers/generator";
import { format } from "date-fns";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import { formatNumberAsCurrency } from "@/lib/helpers";

type Props = {
  user: AuthUser;
  data: ContractAward[];
};

export default async function PageContainer(props: Props) {
  const [expandedAward, setExpandedAward] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedAward(expandedAward === id ? null : id);
  };

  const filteredAwards = useMemo(() => {
    return props.data.filter(
      (award) =>
        award.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.officer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [props.data, searchTerm]);

  const totalAwardedAmount = useMemo(() => {
    return props.data.reduce(
      (sum, award) =>
        sum +
        (award.status === "AWARDED" ? Number(award.quotation.pricing) : 0),
      0
    );
  }, [props.data]);

  const pendingAwards = useMemo(() => {
    return props.data.filter((award) => award.status === "PENDING").length;
  }, []);

  const vendor = useMemo(() => props.data[0].quotation.vendor, [props.data]);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={vendor.logo || undefined} alt={vendor.name} />
            <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <p className="text-muted-foreground">Vendor ID: {vendor.id}</p>
          </div>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Awards
        </Button>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Awarded Amount
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumberAsCurrency(totalAwardedAmount.toLocaleString())}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Awards
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAwards}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Awards</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.data.length}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search by contract ID, status, or officer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => toggleExpand(award.id.toString())}
            >
              <div>
                <h2 className="font-semibold">Contract ID: {award.id}</h2>
                <p className="text-sm text-muted-foreground">
                  Created: {award.created_date}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  variant={
                    award.status === "AWARDED"
                      ? "success"
                      : award.status === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {award.status}
                </Badge>
                <span className="font-semibold">
                  ${award.quotation.pricing?.toLocaleString()}
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
                </dl>
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
