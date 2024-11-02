"use client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";

import ActionConfirmation from "@/Components/ActionConfirmation";
import { submitRFQResponse } from "../actions";

type Props = {
  rfq_id: string;
  autoFocus: boolean;
  closeDialog: () => void;
};

export default function RejectRFQRequest(props: Props) {
  const [isOpen, setOpen] = useState(props.autoFocus);
  const [loading, toggleLoading] = useState(false);
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  async function handleRejection(closeAlertBox: any) {
    const remarks = remarkRef.current?.value;

    if (!remarks?.length) {
      toast.error("A remark is requires", {
        position: "bottom-center",
      });
      return;
    }
    if (remarks.length < 15) {
      toast.error("Remarks requires 15 characters minimum", {
        position: "bottom-center",
      });
      return;
    }

    const formData = new FormData();

    formData.append("reject", "true");
    formData.append("remarks", remarks);
    formData.append("rfq_id", props.rfq_id);

    toggleLoading(true);
    const response = await submitRFQResponse(formData, location.pathname);
    toggleLoading(false);

    if (response.success) {
      toast.success(response.message);
      setOpen(false);
      closeAlertBox?.();
      props.closeDialog();
      return;
    }
    toast.error(response.message);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setOpen(opened);
        if (!opened) props.closeDialog?.();
      }}
    >
      <DialogContent className="max-w-[600px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border-4 shadow-xl">
        <DialogHeader>
          <DialogTitle>Confirm Rejection</DialogTitle>
          <DialogDescription className="max-w-[50ch]">
            Are you sure you want to reject this Quotation,{" "}
            <b className="font-semibold">Note</b> that is action cannot be
            undone
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="py-4">
            <div className="block w-full">
              <Label className="font-semibold pb-1" htmlFor="remarks">
                Remarks
              </Label>
              <Textarea
                ref={remarkRef}
                id="remarks"
                required
                minLength={15}
                className="resize-none"
                placeholder="Write a remark of your rejection"
              ></Textarea>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant={"ghost"}
              className="font-semibold"
              disabled={loading}
            >
              Cancel
            </Button>
            <ActionConfirmation
              onConfirm={handleRejection}
              title="Confirm Rejection"
              description="Note: this action cannot be undone, Are you sure you want to proceed"
              variant="destructive"
            >
              <Button
                disabled={loading}
                variant={"destructive"}
                className="font-semibold"
              >
                {loading ? "Loading..." : "Reject"}
              </Button>
            </ActionConfirmation>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
