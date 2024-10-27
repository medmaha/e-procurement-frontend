import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import Tooltip from "@/Components/ui/tooltip";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  step: ApprovalStepInterface;
};

export default function ApprovalStepDetail({ step }: Props) {
  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{step.name}</h1>
          <p className="text-muted-foreground">
            {step.description || "No description provided."}
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant={step.is_optional ? "secondary" : "default"}>
            {step.is_optional ? "Optional" : "Required"}
          </Badge>
          <Badge variant={step.is_final ? "destructive" : "outline"}>
            {step.is_final ? "Final Step" : "Intermediate Step"}
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Step Information</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-muted-foreground">
              Reference
            </dt>
            <dd>{generate_unique_id("AS", step.id)}</dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Ordering
            </dt>
            <dd>{step.order}</dd>
            <dt className="text-sm font-medium text-muted-foreground">Role</dt>
            <dd className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              {step.role}
            </dd>
            {step.department && (
              <>
                <dt className="text-sm font-medium text-muted-foreground">
                  Department
                </dt>
                <dd className="flex items-center">
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  {step.department?.name}
                </dd>
              </>
            )}
            <dt className="text-sm font-medium text-muted-foreground">
              Time Limit
            </dt>
            <dd className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              {step.time_limit || "No time limit set"}
            </dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Created Date
            </dt>
            <dd className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {new Date(step.created_date).toLocaleDateString()}
            </dd>
            <dt className="text-sm font-medium text-muted-foreground">
              Last Modified
            </dt>
            <dd className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {new Date(step.last_modified).toLocaleDateString()}
            </dd>
          </dl>
        </div>

        {step.approver && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Approver Information</h2>
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={step.approver.name}
                />
                <AvatarFallback>{step.approver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{step.approver.name}</p>
                <p className="text-sm text-muted-foreground">
                  {step.approver.job_title}
                </p>
              </div>
            </div>
            {step.approver.unit?.department && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Unit
                </dt>
                <dd className="flex items-center">
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  {step.approver.unit.name}
                </dd>
                <dt className="text-sm font-medium text-muted-foreground">
                  Department
                </dt>
                <dd className="flex items-center">
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  {step.approver.unit.department.name}
                </dd>
              </dl>
            )}
          </div>
        )}
      </div>

      {step.remarks && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-xl font-semibold mb-4">Remarks</h2>
            <p className="text-muted-foreground">{step.remarks}</p>
          </div>
        </>
      )}

      <Separator className="my-6" />

      <div className="flex justify-between items-center">
        <Tooltip
          content={
            step.is_optional
              ? "This step can be skipped if necessary"
              : "This step must be completed"
          }
        >
          <div className="flex items-center">
            <CheckCircleIcon
              className={`h-5 w-5 ${
                step.is_optional ? "text-yellow-500" : "text-green-500"
              } mr-2`}
            />
            <span className="text-sm font-medium">
              {step.is_optional ? "Optional Step" : "Required Step"}
            </span>
          </div>
        </Tooltip>
        <Tooltip
          content={
            step.is_final
              ? "This is the final step in the approval process"
              : "There are more steps after this one"
          }
        >
          <div className="flex items-center">
            {step.is_final ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
            )}
            <span className="text-sm font-medium">
              {step.is_final ? "Final Step" : "Intermediate Step"}
            </span>
          </div>
        </Tooltip>
      </div>
    </>
  );
}
