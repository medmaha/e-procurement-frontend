"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import SubmitButton from "@/Components/widget/SubmitButton";
import { updateStaff } from "../actions";

export default function DisableStaff({ staff }: any) {
  const [step, setSteps] = useState(0);
  const [open, toggleOpen] = useState(false);
  const [invalid, toggleInvalid] = useState(false);

  useEffect(() => {
    return () => setSteps(0);
  }, []);

  async function submitRemove(formData: FormData) {
    const response = await updateStaff(formData, location.pathname);
    if (response.success) {
      toast.success(
        response.message ?? "Staff " + staff.name + " has been disabled."
      );
      toggleOpen(false);
      return;
    }
    toast.error(response.message ?? "Oops sorry! something went wrong.");
    toast.error("Please try again later.", {
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      hideProgressBar: true,
    });
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          onClick={() => toggleOpen(true)}
          size={"sm"}
          variant={"destructive"}
          className=""
        >
          Disable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] text-foreground">
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center w-full justify-between gap-4 flex-1 pr-5">
              <span className="flex-1 inline-block w-full">
                Disabling Staff{" "}
              </span>
              <small className="text-muted-foreground truncate text-xs self-end pb-1">
                * {staff.name} *
              </small>
            </span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to disable this staff?
          </DialogDescription>
        </DialogHeader>
        <div className="border-t pt-4">
          <b>Caution:</b>
          <ul className="opacity-90 space-y-1 text-sm mt-1 leading-relaxed list-disc pl-6">
            <li>All procurement plans under this staff will be removed.</li>
            <li>
              Ongoing processes, such as requisitions, purchase orders, etc.,
              will be terminated.
            </li>
            <li>
              Procurement requests associated with this staff will be denied.
            </li>
            <li>
              Staff members of this staff will no longer have access to the
              platform.
            </li>
            <li>
              <span className="font-semibold">Good News:</span> This action is
              reversible and can be adjusted later if needed.
            </li>
          </ul>
        </div>
        {step > 0 && (
          <div className="pt-4 border-t">
            <p className="mb-4 text-sm pointer-events-none">
              <strong className="text-muted-foreground">Verify:</strong>
              <br />
              In order to <b>Disable</b> this staff?{" "}
              <span className="pl-2">
                Please type{" "}
                <b className="pl-1 text-muted-foreground pointer-events-auto pt-2 pb-1 inline-block">
                  {staff.name}
                </b>
              </span>
            </p>
            <Input
              className="h-[35px] bg-secondary border-2"
              placeholder="start typing"
              autoFocus
              onChange={(e) => {
                if (e.target.value === staff.name) {
                  setSteps(2);
                  toggleInvalid(false);
                } else {
                  setSteps(1);
                  toggleInvalid(true);
                }
              }}
            />
          </div>
        )}
        <DialogFooter className="border-t pt-4 gap-4">
          <DialogClose asChild>
            <Button
              onClick={() => toggleOpen(false)}
              variant="outline"
              className="font-semibold"
            >
              No Cancel
            </Button>
          </DialogClose>
          <form action={submitRemove}>
            <input name="obj_id" defaultValue={staff.id} hidden />
            <input name="disable" defaultValue={"true"} hidden />
            <_SubmitButton
              step={step}
              invalid={invalid}
              setSteps={setSteps}
              toggleInvalid={toggleInvalid}
              text={
                step === 0
                  ? "Yes, Disable"
                  : invalid
                  ? "Yes, Disable"
                  : "Proceed"
              }
            />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function _SubmitButton({ text, step, invalid, setSteps, toggleInvalid }: any) {
  return (
    <SubmitButton
      disabled={invalid}
      onClick={() => {
        if (step === 0) {
          setSteps(1);
          toggleInvalid(true);
        }
      }}
      text={text}
      type={step < 2 ? "button" : "submit"}
      className="h-max"
      variant={step !== 1 ? "destructive" : "secondary"}
    />
  );
}
