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
import { updateDepartment } from "../actions";

export default function EnableDepartment({ department }: any) {
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
        <Button size={"sm"} onClick={() => toggleOpen(true)}>
          Enable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[580px]">
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center justify-between w-full gap-4">
              Enable {department.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to enable this department?
          </DialogDescription>
        </DialogHeader>
        <div className="border-t pt-4">
          <p className="">
            <b>Note: </b> By continuing with this action, all staffs under this
            department will or can access the platform again.
          </p>
        </div>
        {step > 0 && (
          <div className="pt-4 border-t">
            <p className="mb-2 text-sm text-center pointer-events-none">
              Verify: To enable this department? Please type <br />
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
            <input name="enable" defaultValue={String(step === 2)} hidden />

            <SubmitButton
              onClick={() => {
                if (step === 0) {
                  setSteps(1);
                  toggleInvalid(true);
                }
              }}
              text={invalid ? "Yes Enable" : "Yes Proceed"}
              type={step < 2 ? "button" : "submit"}
              className="h-max font-semibold bg-destructive hover:bg-destructive text-destructive-foreground "
            />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
