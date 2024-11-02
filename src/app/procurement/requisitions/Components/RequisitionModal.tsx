"use client";

import { Check, Loader2, X } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { retrieveRequisition } from "../actions";
import { useQuery } from "@tanstack/react-query";
import RequisitionDetail from "./RequisitionDetail";
import RequisitionInfo from "./RequisitionInfo";

type Props = {
  user: AuthUser;
  children?: ReactNode;
  autoOpen?: boolean;
  onClose?: () => void;
  requisition: Requisition;
};

export default function RequisitionModal(props: Props) {
  const { user, children } = props;
  const [isOpen, setIsOpen] = useState(props.autoOpen || false);

  const requisitionQuery = useQuery({
    enabled: isOpen && !!props.requisition?.id,
    staleTime: Infinity,
    queryKey: ["requisition", props.requisition.id],
    queryFn: async () => {
      const response = await retrieveRequisition(String(props.requisition.id));
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
        if (!opened) {
          props.onClose && props.onClose();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isOpen && (
        <DialogContent className="max-w-[95svw] mx-auto p-0">
          <DialogHeader className="h-max py-2 px-6 border-b flex justify-between w-full">
            <DialogTitle className="text-xl sm:text-2xl capitalize">
              Requisition Details
            </DialogTitle>
            {/* <div className="w-full text-right flex items-center justify-end gap-4">
              <Link
                href={"/procurement/requisitions/" + requisitionQuery.data?.id}
                className="p-1 px-2 h-max transition font-semibold underline-offset-4 hover:outline-muted-foreground outline-2 outline-transparent outline rounded-xl hover:underline text-sm text-muted-foreground hover:text-secondary-foreground bg-secondary "
              >
                More Details
              </Link>
              <Link
                href={"/form-101?m=requisition&i=" + requisitionQuery.data?.id}
                className="p-1 px-2 h-max font-semibold text-sm opacity:70 bg-sky-500 rounded hover:bg-sky-600 transition text-black"
              >
                PDF File
              </Link>
            </div> */}
          </DialogHeader>
          <div className="flex-1 block space-y-6 w-full px-4 h-full max-h-[75svh] overflow-hidden overflow-y-auto">
            {/* <RequisitionDetail
              user={user}
              loading={requisitionQuery.isLoading}
              data={requisitionQuery.data}
            /> */}
            {requisitionQuery.data && (
              <RequisitionInfo
                user={user}
                requisition={requisitionQuery.data}
              />
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
