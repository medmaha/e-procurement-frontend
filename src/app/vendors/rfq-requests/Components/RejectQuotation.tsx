"use client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { submitRFQResponse } from "../actions";

export default function ConfirmRejection(props: any) {
  const [isOpen, setOpen] = useState(false);
  const [reject, toggleReject] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  async function handleRejection(formData: FormData) {
    if (!reject) return toggleReject(true);
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
    toggleLoading(true);
    const response = await submitRFQResponse(formData, location.pathname);
    toggleLoading(false);
    if (response.success) {
      toast.success(response.message);
      setOpen(false);
      props.closeDialog();
      return;
    }
    toast.error(response.message);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => {}}
          className="w-full font-semibold text-lg"
        >
          Reject Quotation
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
          <AlertDialogDescription className="max-w-[40ch]">
            Are you sure you want to reject this Quotation,{" "}
            <b className="font-semibold">Note</b> that is action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={handleRejection}>
          <input type="hidden" name="reject" defaultValue="true" />
          <input
            type="hidden"
            name="remarks"
            defaultValue={remarkRef.current?.value}
          />
          <input
            type="hidden"
            name="quotation"
            defaultValue={props.quotation_id}
          />
          {reject && (
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
          )}
          <AlertDialogFooter>
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant={"ghost"}
              className="font-semibold"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type={"submit"}
              disabled={loading}
              variant={"destructive"}
              className="font-semibold"
            >
              {loading ? "Loading..." : "Reject"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
