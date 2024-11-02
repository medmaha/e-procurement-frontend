"use client";

import { ReactNode, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {
  approveRequisition,
  getDepartmentProcurementPlanItems,
  retrieveRequisition,
} from "../actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { toast } from "react-toastify";
import { Switch } from "@/Components/ui/switch";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { generate_unique_id } from "@/lib/helpers/generator";
import { Loader2 } from "lucide-react";

type Props = {
  user: AuthUser;
  children?: ReactNode;
  autoOpen?: boolean;
  onClose?: () => void;
  requisition: Requisition;
};

export default function RequisitionModal(props: Props) {
  const [isOpen, setIsOpen] = useState(props.autoOpen || false);

  const requisitionQuery = useQuery({
    enabled: isOpen && !!props.requisition?.id,
    staleTime: Infinity,
    queryKey: ["requisition", props.requisition.id],
    queryFn: async () => {
      const response = await retrieveRequisition(String(props.requisition.id));
      if (response.success) {
        return response.data as RequisitionRetrieve;
      }
      throw response;
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setIsOpen(opened);
        if (!opened) {
          props.onClose && props.onClose();
        }
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      {isOpen && (
        <DialogContent className="max-w-[95svw] md:max-w-[700px] mx-auto p-0">
          <DialogHeader className="h-max py-2 px-6 border-b flex justify-between w-full">
            <DialogTitle className="text-xl sm:text-2xl capitalize">
              Requisition Approval
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-[70ch]">
              Please ensure you have reviewed the requisition details before
              using the provided options to approve or reject the requisition.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 block w-full px-4 h-full max-h-[75svh] pb-6 overflow-hidden overflow-y-auto">
            {requisitionQuery.data && (
              <ApprovalForm
                requisition={requisitionQuery.data}
                onSuccess={() => setIsOpen(false)}
              />
            )}
            {requisitionQuery.isLoading && (
              <div className="min-h-[30svh] justify-center flex items-center w-full">
                <Loader2 className="w-12 h-12 stroke-2 animate-spin text-primary" />
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

type ApprovalFormProps = {
  onSuccess: () => void;
  requisition: RequisitionRetrieve;
};

function ApprovalForm({ requisition, onSuccess }: ApprovalFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  async function reject(closeAlertBox: any) {
    // comments must be provided
    if (!commentsRef.current?.value) {
      closeAlertBox && closeAlertBox();
      formRef.current?.focus();
      toast.error("Comments are required");
      return;
    }
    return await submit(closeAlertBox, "rejected");
  }

  async function approve(closeAlertBox: any) {
    return await submit(closeAlertBox, "approved");
  }

  async function submit(closeAlertBox: any, action: "approved" | "rejected") {
    if (!formRef.current?.checkValidity()) {
      closeAlertBox && closeAlertBox();
      formRef.current?.reportValidity();
      return false;
    }

    const formData = new FormData(formRef.current!);
    formData.append("action", action);

    try {
      const response = await approveRequisition(formData, requisition.id);
      if (response.success) {
        closeAlertBox && closeAlertBox();
        toast.success("Requisition approved successfully");
        await queryClient.invalidateQueries({
          queryKey: ["requisitions"],
          exact: false,
        });
        onSuccess && onSuccess();
        return true;
      }
      throw response;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  }

  return (
    <form
      ref={formRef}
      action={() => {
        alert("Action Fired");
      }}
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6 p-4"
    >
      <input
        hidden
        name="requisition"
        defaultValue={requisition.id?.toString()}
      />
      <input
        hidden
        name="workflow_step"
        defaultValue={requisition.current_approval_step?.id?.toString()}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1">
          <Label id="action">Approver</Label>
          <p className="p-2 rounded-md border text-sm text-muted-foreground bg-background">
            {requisition.current_approval_step?.step?.approver?.name}
            {requisition.current_approval_step?.step?.approver?.job_title && (
              <>
                {" - "}(
                {requisition.current_approval_step?.step?.approver?.job_title})
              </>
            )}
          </p>
        </div>
        <div className="grid gap-1">
          <Label id="action">Requisition</Label>
          <p className="p-2 rounded-md border text-sm text-muted-foreground bg-background">
            {generate_unique_id("PR", requisition.id)}
          </p>
        </div>
      </div>
      {/* <div className="grid gap-1">
        <Label id="action">Approval Action</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select approval action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Approve Requisition</span>
              </div>
            </SelectItem>
            <SelectItem value="rejected">
              <div className="flex items-center">
                <XIcon className="w-4 h-4 mr-2 text-destructive" />
                <span>Decline Requisition</span>
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Keep Requisition Pending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="grid gap-1">
        <Label id="remarks">Remarks (optional)</Label>
        <Textarea
          autoFocus
          id="remarks"
          placeholder="Enter your remarks"
          name="comments"
          ref={commentsRef}
        />
      </div>

      <DepartmentProcurementPlans
        department_id={requisition.officer_department?.id!}
      />
      <div className="w-full gap-4 grid sm:grid-cols-2 p-4">
        <ActionConfirmation
          title="Decline Requisition"
          onConfirm={reject}
          variant="destructive"
          confirmText="Decline Requisition"
          description="Are you sure you want to decline this requisition?"
        >
          <Button type="button" variant="destructive">
            Decline Requisition
          </Button>
        </ActionConfirmation>

        <ActionConfirmation
          title="Approve Requisition"
          onConfirm={approve}
          variant="default"
          confirmText="Approve Requisition"
          description="Are you sure you want to approve this requisition?"
        >
          <Button type="button">Approve Requisition</Button>
        </ActionConfirmation>
      </div>
    </form>
  );
}

function DepartmentProcurementPlans({ department_id }: any) {
  const [partOfAnnualPlan, togglePartOfAnnualPlan] = useState(false);
  const [annualPlan, setAnnualPlan] = useState<string | undefined>(undefined);

  const departmentPlansQuery = useQuery({
    enabled: !!department_id,
    queryKey: ["department_plans", department_id],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await getDepartmentProcurementPlanItems(department_id);
      if (response.success) {
        return response.data;
      }
      throw response;
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="part_of_annual_plan">Part of Annual Plan</Label>
        {/* TODO: Make sure this switch is does not toggle when the annual plan is not selected*/}
        <div className="inline-flex items-center">
          <Switch
            id="part_of_annual_plan"
            name="part_of_annual_plan"
            value={"YES"}
            onCheckedChange={togglePartOfAnnualPlan}
          />
          <span className="ml-2 text-xs text-muted-foreground">
            Specify whether the requisition is part of an annual plan
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="part_of_annual_plan">Annual Procurement Plan</Label>
        <Select
          name="annual_procurement_plan"
          disabled={!partOfAnnualPlan}
          required={partOfAnnualPlan}
          value={annualPlan}
          onValueChange={setAnnualPlan}
        >
          <SelectTrigger
            title={
              partOfAnnualPlan
                ? ""
                : "It must be part of an annual plan before selecting a plan"
            }
            className="disabled:cursor-default"
          >
            <SelectValue
              placeholder={partOfAnnualPlan ? "Specify the plan" : ""}
            />
          </SelectTrigger>
          <SelectContent className="p-0">
            <SelectGroup>
              <SelectLabel>
                {departmentPlansQuery.data &&
                departmentPlansQuery.data.length < 1
                  ? "No annual plans for this Department"
                  : "Annual Procurement Plan"}
              </SelectLabel>

              {departmentPlansQuery.data?.map((plan: any) => {
                return (
                  <SelectItem
                    key={plan.id}
                    value={String(plan.id)}
                    className="capitalize"
                  >
                    {plan.description}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
