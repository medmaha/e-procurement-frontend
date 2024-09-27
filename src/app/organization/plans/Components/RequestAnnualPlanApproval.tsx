"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { toast } from "react-toastify";
import { requestAnnualPlanApproval } from "../actions";

type Props = {
  user: AuthUser;
  annualPlan: AnnualPlan;
  requestType: "ORG" | "GPPA" | "BOTH";
};

export function RequestAnnualPlanApproval({
  user,
  annualPlan,
  requestType,
}: Props) {
  const [invalidate, setInvalidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (user.profile_id != annualPlan.officer?.id) return null;

  async function handleSubmit() {
    const payload = {
      annual_plan_id: annualPlan.id,
      request_type: requestType,
    };
    setLoading(true);
    const response = await requestAnnualPlanApproval(
      payload,
      location.pathname
    );
    setLoading(false);

    if (response.success) {
      setInvalidated(true);
      toast.success(response.message);
      return;
    }
    toast.error(response.message);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={invalidate}
          variant="outline"
          className="disabled:pointer-events-none disabled:opacity-50 font-semibold"
        >
          {invalidate ? "Approval Submitted" : "Submit for Approval"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[650px] bg-card text-card-foreground border-2 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-2xl">
            Are you sure you want to approve this annual plan?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-lg">
            This action initiates the approval workflow for the annual
            procurement plan. Notifications will be dispatched to all relevant
            approvers, including the GPPA, for their approval.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 border-t">
          <AlertDialogCancel className="font-semibold text-lg">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="font-semibold text-lg"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
