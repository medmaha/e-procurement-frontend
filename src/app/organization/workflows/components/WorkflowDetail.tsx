import React from "react";
import { format } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Link from "next/link";

interface WorkflowDetailProps {
  workflow: WorkflowInterface;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflow }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{workflow.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium">Created By</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                <Link
                  href={`/organization/staff/${workflow.officer?.id}`}
                  className="hover:text-primary hover:underline underline-offset-4 transition"
                >
                  {workflow.officer?.name}
                </Link>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium">Status</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                <Badge
                  variant={
                    workflow.status === "active" ? "success" : "destructive"
                  }
                >
                  {workflow.status || "Inactive"}
                </Badge>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium">Created At</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {format(new Date(workflow.created_date), "PPp")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium">Last Modified</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {format(new Date(workflow.last_modified), "PPPpp")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium">Description</dt>
              <dd className="mt-1 text-sm line-clamp-3 text-muted-foreground max-w-[100ch]">
                {workflow.description}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {workflow.approval_steps?.map((step, index) => (
              <li key={step.id} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} alt={"Mahammed Touray"} />
                    <AvatarFallback>MT</AvatarFallback>
                  </Avatar>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Step {index + 1}:&nbsp;{step.name}
                </h3>
                <p className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Approver: Mahammed Touray
                </p>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  Role: {step.role}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDetail;
