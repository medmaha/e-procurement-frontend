import React from "react";
import { Clock, Briefcase, Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import { format } from "date-fns";
import { cn } from "@/lib/ui/utils";
import { generate_unique_id } from "@/lib/helpers/generator";

export default function WorkflowDetails({
  workflow,
}: {
  workflow: WorkflowInterface;
}) {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-1 mb-2">
          <h3 className="font-semibold text-lg">{workflow.name}</h3>
          <p className="text-sm text-muted-foreground">
            {workflow.description}
          </p>
        </div>
        <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
          {workflow.status}
        </Badge>
      </div>
      <div className="mb-6 text-sm">
        <h3 className="text-lg font-semibold mb-2">Workflow Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Reference</p>
            <p className="">{generate_unique_id("WF", workflow.id)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created Date</p>
            <p className="">{format(new Date(workflow.created_date), "PPp")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Modified</p>
            <p>{format(new Date(workflow.last_modified), "PPp")}</p>
          </div>
          {workflow.author && (
            <div className="">
              <p className="text-sm text-muted-foreground pb-0.5">Created By</p>
              <StaffAvatar staff={workflow.author} />
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Workflow Steps</h3>
        <div className="space-y-4">
          {workflow.workflow_steps.map((workflowStep, index) => (
            <div
              className="flex relative gap-1 pl-[35px]"
              key={workflowStep.id.toString()}
            >
              <div className="absolute top-0 left-0 w-[30px] h-full flex justify-center items-center">
                <div
                  className={cn(
                    `w-[90%] h-[28px] bg-primary text-primary-foreground font-semibold justify-center
                 items-center inline-flex rounded-full border-2`,
                    index !== workflow.workflow_steps.length - 1 &&
                      "before:h-full before:w-[2px] before:bg-primary/50 before:absolute before:left-1/2 before:translate-y-[calc(50%_+_14px)] before:-translate-x-1/"
                  )}
                >
                  {workflowStep.order}
                </div>
              </div>
              <Card className="bg-card/50 flex-1">
                <CardHeader>
                  <CardTitle className="text-base">
                    {workflowStep.step.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Step Details</h4>
                      <p className="text-sm">
                        <span className="font-medium">Order:</span>{" "}
                        {workflowStep.order}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Condition:</span>{" "}
                        {workflowStep.condition || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(
                          workflowStep.created_date
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Last Modified:</span>{" "}
                        {new Date(
                          workflowStep.last_modified
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="mb-2">
                        <p className="text-sm">Created By:</p>
                        <StaffAvatar
                          staff={workflowStep.author}
                          className="text-sm"
                        />
                      </div>

                      {workflowStep.step.role && (
                        <p className="text-sm">
                          <span className="font-medium">Role:</span>{" "}
                          {workflowStep.step.role}
                        </p>
                      )}

                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">
                          {workflowStep.step.is_final ? "Final" : "Not Final"}
                        </Badge>
                        <Badge variant="outline">
                          {workflowStep.step.is_optional
                            ? "Optional"
                            : "Required"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {workflowStep.step.approver && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Approver</h4>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={workflowStep.step.approver.avatar}
                            alt={workflowStep.step.approver.name}
                          />
                          <AvatarFallback>
                            {workflowStep.step.approver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {workflowStep.step.approver.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {workflowStep.step.approver.job_title}
                          </p>
                        </div>
                      </div>
                      {workflowStep.step.approver.unit && (
                        <p className="text-sm mt-1">
                          <Briefcase className="inline-block w-4 h-4 mr-1" />
                          {workflowStep.step.approver.unit.name}
                        </p>
                      )}
                    </div>
                  )}
                  {workflowStep.step.department && (
                    <p className="text-sm mt-2">
                      <Building2 className="inline-block w-4 h-4 mr-1" />
                      Department: {workflowStep.step.department.name}
                    </p>
                  )}
                  {workflowStep.step.time_limit && (
                    <p className="text-sm mt-2">
                      <Clock className="inline-block w-4 h-4 mr-1" />
                      Time Limit: {workflowStep.step.time_limit}
                    </p>
                  )}
                  {workflowStep.step.remarks && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Remarks:</span>{" "}
                      {workflowStep.step.remarks}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
