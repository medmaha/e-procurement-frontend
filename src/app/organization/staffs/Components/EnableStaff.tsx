"use client";
import { useEffect, useState } from "react";
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

export default function EnableStaff({ staff }: any) {
  const [step, setSteps] = useState(0);
  const [isOpen, toggleOpen] = useState(false);
  const [invalid, toggleInvalid] = useState(false);

  useEffect(() => {
    return () => setSteps(0);
  }, []);

  async function submitRemove(formData: FormData) {
    const response = await updateStaff(formData);
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
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => toggleOpen(true)} size={"sm"} className="">
          Enable
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="max-w-[580px]">
          <DialogHeader>
            <DialogTitle>
              <span className="inline-flex items-center justify-between w-full gap-4">
                Enable {staff.name}
                <small className="text-muted-foreground truncate pr-4">
                  * Disabled *
                </small>
              </span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to enable this staff?
            </DialogDescription>
          </DialogHeader>
          <div className="border-t pt-4">
            <p className="">
              <b>Note: </b> By continuing with this action, &quot;{staff.name}
              &quot; will or can access the platform again.
            </p>
          </div>
          {step > 0 && (
            <div className="pt-4 border-t">
              <p className="mb-4 text-sm pointer-events-none">
                <strong className="text-muted-foreground ">Verify:</strong>
                <br /> In order to <b>Enable</b> this staff?{" "}
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
                required
                onInput={(e) => {
                  const value = (e.target as any)?.value;

                  if (value === staff.name) {
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
              <input name="enable" defaultValue={"true"} hidden />
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
                    : "Proceed"
                }
              />
            </form>
          </DialogFooter>
        </DialogContent>
      )}
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
      variant={step !== 1 ? "default" : "secondary"}
    />
  );
}
