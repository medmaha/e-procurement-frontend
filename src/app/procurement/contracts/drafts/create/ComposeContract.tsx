import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/Components/ui/dialog";
import React from "react";
import CreateContainer from "./CreateContainer";

type Props = {
  user: AuthUser;
  award_id: ID;
  onDialogClose: () => void;
  vendor: ContractAward["quotation"]["vendor"];
};

export default function ComposeContract({ onDialogClose, ...props }: Props) {
  const handleCreateContract = async (formData: any) => {
    return new Promise<any>((resolve) => setTimeout(() => resolve({}), 5_000));
  };
  return (
    <Dialog open={true} onOpenChange={onDialogClose}>
      <DialogContent className="p-0 max-w-[95svw] lg:max-w-[1000px] w-full ">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>New Contract Contract</DialogTitle>
          <DialogDescription>
            Create a new contract draft for the awarded vendor. Fill in the
            necessary details to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[85svh] overflow-y-auto overflow-hidden ">
          <CreateContainer
            hideTitle
            user={props.user}
            award_id={props.award_id}
            vendor_id={props.vendor.id}
            onSuccess={onDialogClose}
            handleCreateContract={handleCreateContract}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
