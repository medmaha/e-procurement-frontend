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
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  staff: Staff;
  user: AuthUser;
  onClose?: any;
};

export default function StaffActivation({ staff, ...props }: Props) {
  const [step, setSteps] = useState(0);
  const [invalid, toggleInvalid] = useState(false);

  const queryClient = useQueryClient();

  async function submitForm() {
    const formData = new FormData();
    formData.append("obj_id", staff.id.toString());
    formData.append(isActivate ? "enable" : "disable", "true");

    const response = await updateStaff(formData);
    if (response.success) {
      toast.success(
        response.message ??
          `Staff ${staff.name} has been ${
            isActivate ? "enabled" : "disabled"
          } successfully.`
      );
      // invalidate queries
      // FIXME: avoid refetching this query when closing modal
      await queryClient.invalidateQueries({
        queryKey: ["staff", staff?.id, props.user.profile_id],
        refetchType: "none",
      });

      // Staff list table invalidation
      queryClient.invalidateQueries({
        queryKey: ["staffs", props.user.profile_id],
      });
      props.onClose?.();
      return;
    }

    toast.error(response.message ?? "Oops sorry! something went wrong.");
    toast.error("Please try again later.", {
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      hideProgressBar: true,
    });
  }

  const isActivate = staff.disabled === true;
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(opened) => {
        !opened && props.onClose?.();
      }}
    >
      <DialogContent className="max-w-[600px] text-foreground">
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center w-full justify-between gap-4 flex-1 pr-5">
              <span className="flex-1 inline-block w-full">
                {staff.disabled ? "Activating" : "Deactivating"} Staff{" "}
              </span>
              <small className="text-muted-foreground truncate text-xs self-end pb-1">
                * {staff.name} *
              </small>
            </span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {isActivate ? "enable" : "disable"} this
            staff?
          </DialogDescription>
        </DialogHeader>
        {step === 0 && (
          <div className="border-t pt-4">
            <b>Caution:</b>
            <ul className="opacity-90 space-y-1 text-sm mt-1 leading-relaxed list-disc pl-6">
              {isActivate && (
                <>
                  <li>
                    By continuing with this action, &quot;{staff.name}
                    &quot; will or can access the platform again.
                  </li>
                  <li>
                    <span className="font-semibold">Good News:</span> This
                    action is reversible and can be adjusted later if needed.
                  </li>
                </>
              )}
              {!isActivate && (
                <>
                  <li>
                    By continuing &quot;{staff.name}
                    &quot; will no longer have access to the platform.
                  </li>
                  <li>
                    <span className="font-semibold">Good News:</span> This
                    action is reversible and can be adjusted later if needed.
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
        {step > 0 && (
          <div className="pt-4 border-t">
            <p className="mb-4 text-sm pointer-events-none">
              <span className="text-base pr-2">Process Verification:</span>
              <br />
              In order to <b>{isActivate ? "activate" : "disable"}</b> this
              staff! Please type &nbsp;
              <b className="pl-1 underline underline-offset-4 text-muted-foreground pointer-events-auto">
                {staff.name}
              </b>
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
              onClick={() => props?.onClose?.()}
              variant="outline"
              className="font-semibold"
            >
              No Cancel
            </Button>
          </DialogClose>
          <form action={submitForm}>
            <SubmitButton
              disabled={invalid}
              onClick={() => {
                if (step === 0) {
                  setSteps(1);
                  toggleInvalid(true);
                }
              }}
              text={
                step === 0
                  ? `Yes, ${isActivate ? "Enable" : "Disable"}`
                  : invalid
                  ? `Yes, ${isActivate ? "Enable" : "Disable"}`
                  : "Proceed"
              }
              type={step < 2 ? "button" : "submit"}
              className="h-max"
              variant={isActivate ? "default" : "destructive"}
            />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
