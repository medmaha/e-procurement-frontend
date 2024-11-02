"use client";
import { Check, Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";
import { retrieveRequisition } from "../actions";
import { useQuery } from "@tanstack/react-query";

type Props = {
  requisition: Requisition;
};

export default function ViewApproval(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const requisitionQuery = useQuery<RequisitionRetrieve>({
    enabled: isOpen && !!props.requisition?.id,
    staleTime: Infinity,
    queryKey: ["requisition", props.requisition.id],
    queryFn: async () => {
      const response = await retrieveRequisition(String(requisition.id));
      if (response.success) {
        return response.data as RequisitionRetrieve;
      }
      throw response;
    },
  });

  const requisition = useMemo(() => {
    return {
      ...props.requisition,
      ...requisitionQuery.data,
    };
  }, [props.requisition, requisitionQuery.data]);

  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="capitalize opacity-60 inline-flex items-center gap-1"
        >
          <ApprovedStatus requisition={requisition} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-max max-h-[90dvh] overflow-auto overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="sm:text-2xl">Approval Record</DialogTitle>
          <DialogDescription asChild>
            <p className="text-sm py-0 my-0">
              The following is the approval record of this requisition.
            </p>
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <RequisitionApprovalContent requisition={requisition as any} />
        )}
      </DialogContent>
    </Dialog>
  );
}

type ContentProps = {
  hideStatus?: boolean;
  showStatusText?: boolean;
  requisition: RequisitionRetrieve;
};

export function RequisitionApprovalContent(props: ContentProps) {
  const { requisition, hideStatus, showStatusText } = props;
  return (
    <>
      <div className="py-2 grid grid-cols-4 gap-6 mt-2">
        {requisition.approvals?.map((approval) => {
          return (
            <div key={approval.id} className="grid gap-1 text-sm">
              <p className="text text-base">
                {approval.workflow_step.step?.name}
              </p>
              <ApprovedContent
                showStatusText={showStatusText}
                data={approval}
              />
            </div>
          );
        })}
      </div>
      {requisition.approval_status === "pending" && !hideStatus && (
        <div className="py-2 flex w-full flex-wrap justify-between items-center gap-6 mt-2">
          <div className="grid gap-1">
            <p className="text-lg font-bold">Status</p>
            <p className="capitalize opacity-60 inline-flex items-center gap-1">
              <ApprovedStatus requisition={requisition} animate={true} />
            </p>
          </div>

          {requisition.approval_status === "pending" && (
            <div className="grid gap-1">
              <p className="text-lg font-bold">Approval Stage</p>
              <p className="capitalize opacity-60 inline-flex items-center gap-1">
                <span>{requisition.current_approval_step?.step.name}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

type PropsApproval = {
  animate?: boolean;
  requisition: Requisition;
};

function ApprovedStatus({ requisition, animate }: PropsApproval) {
  return (
    <>
      <span className="pt-0.5 inline-block">
        {requisition.approval_status == "pending" ? (
          <Loader2
            size={"16"}
            className={`text-accent-foreground ${
              animate ? "animate-spin" : ""
            }`}
          />
        ) : requisition.approval_status == "rejected" ? (
          <X size={"16"} className="text-destructive" />
        ) : (
          <Check size={"16"} className="text-primary" />
        )}
      </span>
      <span className="opacity-60">{requisition.approval_status}</span>
    </>
  );
}

type PropsApprovalContent = {
  data: PRApprovalAction;
  showStatusText?: boolean;
};

function ApprovedContent({ data, showStatusText }: PropsApprovalContent) {
  return (
    <p
      className={`inline-flex items-center gap-2 ${
        data.action === "approved" ? "text-green-500" : "text-destructive"
      }`}
    >
      {data.id ? (
        <span title={data.action === "approved" ? "Approved" : "Declined"}>
          <Switch
            checked={data.action === "approved"}
            onCheckedChange={() => {}}
            className="cursor-default h-[22px]"
          />
        </span>
      ) : (
        <span
          title="No Approval"
          className="text-muted-foreground text-sm capitalize"
        >
          {data.action}
        </span>
      )}
      {data.id && showStatusText && (
        <small className="font-semibold uppercase tracking-wide">
          {data.action === "approved" ? "Approved" : "Declined"}
        </small>
      )}
    </p>
  );
}
