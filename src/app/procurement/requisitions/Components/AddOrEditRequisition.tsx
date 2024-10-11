"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import RequisitionCreateWrapper from "../create/Components/RequisitionCreateWrapper";
import { useQuery } from "@tanstack/react-query";
import { retrieveRequisition } from "../actions";

type Props = {
  children?: any;
  user: AuthUser;
  autoOpen?: boolean;
  onClose?: () => void;
  requisition?: Requisition;
};

export default function AddOrEditRequisition(props: Props) {
  const { children, requisition, user, autoOpen } = props;
  const [isOpen, setIsOpen] = useState(autoOpen);

  const requisitionQuery = useQuery({
    enabled: isOpen && !!requisition,
    staleTime: Infinity,
    queryKey: ["requisition", requisition?.id],
    queryFn: async () => {
      const response = await retrieveRequisition(String(requisition!?.id));
      if (response.success) {
        return response.data as RequisitionRetrieve;
      }
      throw response;
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setIsOpen(opened);
        !opened && props.onClose?.();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[1200px] mx-auto">
        <DialogHeader>
          <DialogTitle className="sm:text-2xl">
            {requisition ? "Edit Requisition" : "New Requisition"}
          </DialogTitle>
          <DialogDescription>
            {requisition
              ? "Update the existing requisition details."
              : "Provide the details for the new requisition."}
          </DialogDescription>
        </DialogHeader>
        <RequisitionCreateWrapper
          user={user}
          loading={requisitionQuery.isLoading}
          requisition={requisitionQuery.data}
          closeDialog={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
