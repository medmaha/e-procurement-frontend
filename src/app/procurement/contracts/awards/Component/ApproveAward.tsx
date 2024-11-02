"use client";
import { ReactNode, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import StaffAvatar from "@/Components/widget/StaffAvatar";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Button } from "@/Components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";

type Props = {
  user: AuthUser;
  autoOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  award: ContractAward;
};

export default function ContractAwardApproval(props: Props) {
  const [isOpen, setIsOpen] = useState(props.autoOpen || false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(closed) => {
        setIsOpen(closed);
        if (closed) props.onClose?.();
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-w-[600px] mx-auto p-0">
        <DialogHeader className="px-6 pt-4 pb-2">
          <DialogTitle className="text-xl sm:text-2xl capitalize">
            Contract Award Approval
          </DialogTitle>
          <DialogDescription>
            Please confirm your approval or rejection of this contract award.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80dvh] overflow-hidden overflow-y-auto px-6">
          {isOpen && (
            <AwardApprovalForm
              closeDialog={() => setIsOpen(false)}
              award={props.award}
              user={props.user}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AwardApprovalFormProps = {
  user: AuthUser;
  award: ContractAward;
  closeDialog: () => void;
};

const AwardApprovalForm = (props: AwardApprovalFormProps) => {
  const commentRef = useRef<string>();

  async function reject(closeAlertBox: any) {
    const comment = commentRef.current;

    if (!comment) {
      toast.error("Please provide a comment");
      return;
    }
    if (comment.length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    const data = {
      remarks: comment,
      approve: false,
    };
    await handleSubmit(data, closeAlertBox);
  }

  async function approve(closeAlertBox: any) {
    const comment = commentRef.current || "";
    const data = {
      remarks: comment,
      approve: true,
    };
    await handleSubmit(data, closeAlertBox);
  }

  const queryClient = useQueryClient();

  const handleSubmit = async (data: Json, closeAlertBox: any) => {
    data.approval_mode = true;
    const response = await actionRequest({
      data,
      method: "put",
      pathname: location.pathname,
      url: `/procurement/contracts/awards/${props.award.id}/`,
    });

    if (response.success) {
      // Notify the user
      toast.success(response.message);

      // Invalid the rfq query so it is refetch again
      await queryClient.invalidateQueries({
        queryKey: ["rfq"],
        exact: false,
      });

      // Close the confirmation AlertDialog
      closeAlertBox?.();

      // Close the approval-form modal
      return props.closeDialog();
    }

    // Notify the user about the error
    toast.error(response.message);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="block w-full">
      <div className="flex flex-wrap w-full gap-4 justify-around pt-2.5 lg:pt-4 pb-5 lg:pb-8">
        <div className="mb-4 grid gap-2">
          <Label htmlFor="remark" className="">
            Created By
          </Label>
          <StaffAvatar staff={props.award.officer} noLink />
        </div>
        <div className="mb-4 grid gap-2">
          <Label htmlFor="remark" className="">
            Approval Officer
          </Label>
          <StaffAvatar
            staff={{
              id: props.user.profile_id,
              name: props.user.name,
            }}
            noLink
          />
        </div>
      </div>

      {/* Textarea for remark */}
      <div className="mb-4">
        <Label htmlFor="remark" className="font-semibold">
          Remark
        </Label>
        <Textarea
          id="remark"
          name="remark"
          rows={2}
          placeholder="Enter remark"
          autoFocus
          onChange={({ currentTarget }) => {
            commentRef.current = currentTarget.value;
          }}
        />
      </div>

      {/* Submit button */}
      <div className="mb-4 grid sm:gap-4 sm:grid-cols-2 w-full">
        <ActionConfirmation
          title="Reject RFQ"
          description="Are you sure you want to reject this RFQ?"
          variant="destructive"
          onConfirm={reject}
          confirmText="Yes Reject"
        >
          <Button variant="destructive" type="button">
            Reject
          </Button>
        </ActionConfirmation>
        <ActionConfirmation
          title="Approve RFQ"
          description="Are you sure you want to approve this RFQ?"
          onConfirm={approve}
          confirmText="Yes Approve"
        >
          <Button type="button">Approve</Button>
        </ActionConfirmation>
      </div>
    </form>
  );
};