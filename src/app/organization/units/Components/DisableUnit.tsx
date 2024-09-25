"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { updateUnit } from "../actions";
import { toast } from "react-toastify";
import SubmitButton from "@/Components/widget/SubmitButton";

export default function DisableUnit({ unit }: any) {
  const [step, setSteps] = useState(0);
  const [open, toggleOpen] = useState(false);
  const [invalid, toggleInvalid] = useState(false);

  async function submitRemove(formData: FormData) {
    const response = await updateUnit(formData, location.pathname);
    if (response.success) {
      toast.success(
        response.message ?? "Unit " + unit.name + " has been disabled."
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
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={() => toggleOpen(true)}
        >
          Disable
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[600px] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="inline-flex items-center w-full justify-between gap-4 flex-1">
              <span className="flex-1 inline-block w-full">
                Disabling Unit{" "}
              </span>
              <small className="text-muted-foreground truncate text-xs self-end pb-1">
                * {unit.name} *
              </small>
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disable this unit?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border-t pt-4">
          <b>Caution:</b>
          <ul className="opacity-90 space-y-1 text-sm mt-1 leading-relaxed">
            <li>All procurement plans under this unit will be removed.</li>
            <li>
              Ongoing processes, such as requisitions, purchase orders, etc.,
              will be terminated.
            </li>
            <li>
              Procurement requests associated with this unit will be denied.
            </li>
            <li>
              Staff members of this unit will no longer have access to the
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
            <p className="mb-2 text-sm text-center pointer-events-none">
              Verify: To disable this unit? Please type <br />
              <b className="text-muted-foreground pointer-events-auto pt-2 pb-1 inline-block">
                {unit.name}
              </b>
            </p>
            <Input
              className="h-[35px] bg-secondary border-2"
              placeholder="start typing"
              autoFocus
              onChange={(e) => {
                if (e.target.value === unit.name) {
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
        <AlertDialogFooter className="border-t pt-4 gap-4">
          <AlertDialogCancel asChild>
            <Button
              onClick={() => toggleOpen(false)}
              variant="outline"
              className="font-semibold"
            >
              No Cancel
            </Button>
          </AlertDialogCancel>
          <form action={submitRemove}>
            <input name="obj_id" value={unit.id} hidden />
            <input name="disable" value={String(step === 2)} hidden />
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
                  : "Confirm Disable"
              }
            />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      type={step < 2 ? "button" : "submit"}
      className="h-max font-semibold bg-destructive hover:bg-destructive text-destructive-foreground "
      text={text}
    />
  );
}
