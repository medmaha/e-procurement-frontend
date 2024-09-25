"use client";
import { useState } from "react";
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

export default function EnableUnit({ unit }: any) {
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
        <Button onClick={() => toggleOpen(true)} size={"sm"}>
          Enable
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[580px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="inline-flex items-center justify-between w-full gap-4">
              Enable {unit.name}
              <small className="text-muted-foreground truncate">
                * Disabled *
              </small>
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to enable this unit?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border-t pt-4">
          <p className="">
            <b>Note: </b> By continuing with this action, all staffs under this
            unit will or can access the platform again.
          </p>
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
            <input name="enable" value={String(step === 2)} hidden />
            <_SubmitButton
              step={step}
              invalid={invalid}
              setSteps={setSteps}
              toggleInvalid={toggleInvalid}
              text={
                step === 0
                  ? "Yes, Enable"
                  : invalid
                  ? "Yes, Enable"
                  : "Confirm Enable"
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
      text={text}
      type={step < 2 ? "button" : "submit"}
      className="h-max font-semibold bg-destructive hover:bg-destructive text-destructive-foreground "
    />
  );
}
