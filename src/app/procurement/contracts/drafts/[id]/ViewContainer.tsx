"use client";

import { lazy, Suspense, useState } from "react";
import { Calendar, FileText, Download, Edit, Trash } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { format } from "date-fns";
import { ActionRespond } from "@/lib/utils/actionRequest";

type Props = {
  user: AuthUser;
  data: Contract;
  updateContract: (
    contract_id: ID,
    data: any
  ) => Promise<ActionRespond<any, Json>>;
};

const UpdateContractLazy = lazy(() => import("../create/UpdateContract"));

export default function ViewContainer({ user, data, ...props }: Props) {
  const [activeTab, setActiveTab] = useState("details");
  const [edit, toggleEdit] = useState(false);

  return (
    <div className="container mx-auto space-y-6">
      <Suspense>
        {edit && (
          <UpdateContractLazy
            user={user}
            contract={data}
            onDialogClose={() => toggleEdit(false)}
            handleCreateContract={async (_data) =>
              props.updateContract(data.id, _data)
            }
          />
        )}
      </Suspense>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => toggleEdit(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Badge variant={data.status === "Active" ? "success" : "secondary"}>
          {data.status}
        </Badge>
        <Badge
          variant={data.approval_status === "approved" ? "success" : "outline"}
        >
          {data.approval_status}
        </Badge>
        {data.start_date && data.end_date && (
          <div className="flex items-center text-sm text-accent-foreground/80">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(data.start_date), "P")} -{" "}
            {format(new Date(data.end_date), "PPp")}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Payment Terms
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.payment_terms}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Delivery Schedule
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.delivery_schedule}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Terms and Conditions
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.terms_and_conditions}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Confidentiality Clause
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.confidentiality_clause ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Penalty Clause
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    ${data.penalty_clause?.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Approval Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Approval Date
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.approval_date}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-accent-foreground/80">
                    Approval Remarks
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {data.approval_remarks}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={data.supplier.logo}
                    alt={data.supplier.name}
                  />
                  <AvatarFallback>
                    {data.supplier.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {data.supplier.name}
                  </h3>
                  <p className="text-sm text-accent-foreground/80">
                    {data.supplier.short_desc}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Procurement Officer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={data.officer.avatar}
                    alt={data.officer.name}
                  />
                  <AvatarFallback>{data.officer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{data.officer.name}</h3>
                  <p className="text-sm text-accent-foreground/80">
                    {data.officer.job_title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Contract Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.attachments?.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">{attachment.name}</h4>
                        <p className="text-sm text-accent-foreground/80">
                          Uploaded on:{" "}
                          {new Date(
                            attachment.uploaded_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotation">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent>
              {data.quotation ? (
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Quotation ID
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {data.quotation.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      RFQ ID
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {data.quotation.rfq_id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Delivery Date
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {data.quotation.delivery_date}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Created Date
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {data.quotation.created_date}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Pricing
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      ${data.quotation.pricing.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-accent-foreground/80">
                      Evaluation Status
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      <Badge
                        variant={
                          data.quotation.evaluation_status === "AWARDED"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {data.quotation.evaluation_status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p>No quotation information available for this contract.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
