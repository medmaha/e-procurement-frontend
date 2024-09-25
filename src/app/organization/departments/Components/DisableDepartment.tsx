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
import { updateDepartment } from "../actions";

export default function DisableDepartment({ department }: any) {
  const [step, setSteps] = useState(0);
  const [open, toggleOpen] = useState(false);
  const [invalid, toggleInvalid] = useState(true);

  useEffect(() => {
    return () => setSteps(0);
  }, []);

  async function submitRemove(formData: FormData) {
    const response = await updateDepartment(formData, location.pathname);
    if (response.success) {
      toast.success(
        response.message ??
          "Department " + department.name + " has been disabled."
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
          variant={"destructive"}
          size={"sm"}
          onClick={() => toggleOpen(true)}
        >
          Disable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] text-foreground">
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center w-full justify-between gap-4 flex-1">
              <span className="flex-1 inline-block w-full">
                Disable {department.name}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to disable this department?
          </DialogDescription>
        </DialogHeader>
        <div className="border-t pt-4">
          <b>Caution:</b>
          <ul className="opacity-90 space-y-1 text-sm mt-1 leading-relaxed">
            <li>
              All procurement plans under this department will be removed.
            </li>
            <li>
              Ongoing processes, such as requisitions, purchase orders, etc.,
              will be terminated.
            </li>
            <li>
              Procurement requests associated with this department will be
              denied.
            </li>
            <li>
              Staff members of this department will no longer have access to the
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
              Verify: To disable this department? Please type <br />
              <b className="text-muted-foreground pointer-events-auto pt-2 inline-block">
                {department.name}
              </b>{" "}
            </p>
            <Input
              className="h-[35px] bg-secondary border-2"
              placeholder="start typing"
              autoFocus
              onChange={(e) => {
                if (e.target.value === department.name) {
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
            <input name="obj_id" defaultValue={department.id} hidden />
            <input name="disable" defaultValue={String(step === 2)} hidden />
            <SubmitButton
              onClick={() => {
                if (step === 0) {
                  setSteps(1);
                  toggleInvalid(true);
                }
              }}
              variant={"destructive"}
              text={invalid ? "Yes Disable" : "Yes Proceed"}
              type={step < 2 ? "button" : "submit"}
              className="h-max font-semibold bg-destructive hover:bg-destructive text-destructive-foreground "
            />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
