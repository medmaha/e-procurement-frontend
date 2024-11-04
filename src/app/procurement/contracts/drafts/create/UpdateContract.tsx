import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/Components/ui/dialog";
import { ActionRespond } from "@/lib/utils/actionRequest";
import React from "react";
import CreateContainer from "./CreateContainer";

type Props = {
  user: AuthUser;
  contract?: Contract;
  hideTitle?: boolean;
  onDialogClose: () => void;
  //   handleCreateContract: (formData: any) => Promise<ActionRespond<any, Json>>;
  handleCreateContract: (formData: any) => Promise<any>;
};

export default function UpdateContract({ onDialogClose, ...props }: Props) {
  return (
    <Dialog open={true} onOpenChange={onDialogClose}>
      <DialogContent className="p-0 max-w-[95svw] lg:max-w-[1000px] w-full ">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Update Contract</DialogTitle>
          <DialogDescription>
            Make changes to your contract draft. All modifications will be saved
            automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[85svh] overflow-y-auto overflow-hidden ">
          <CreateContainer onSuccess={onDialogClose} hideTitle {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
