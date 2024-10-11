"use client";

import { Check, Loader2, X } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { retrieveRequisition } from "../actions";
import { useQuery } from "@tanstack/react-query";
import RequisitionDetail from "./RequisitionDetail";

type Props = {
  user: AuthUser;
  children?: ReactNode;
  defaultOpen?: boolean;
  onClose?: () => void;
  requisition: Requisition;
};

export default function RequisitionModal(props: Props) {
  const { user, children } = props;
  const [isOpen, setIsOpen] = useState(props.defaultOpen || false);

  const requisitionQuery = useQuery({
    enabled: isOpen,
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
            <RequisitionDetail
              user={user}
              loading={requisitionQuery.isLoading}
              data={requisitionQuery.data}
            />
          </div>

          <div className="py-4 flex flex-wrap justify-between items-center gap-6 px-6">
            <div className="grid gap-1">
              <p className="text-lg font-bold">Approval Status</p>
              <p className="capitalize opacity-60 inline-flex items-center gap-1">
                <span className="pt-0.5 inline-block">
                  {requisitionQuery.data?.approval.status.toLowerCase() ==
                  "pending" ? (
                    <Loader2
                      size={"16"}
                      className={`text-accent-foreground animate-spin`}
                    />
                  ) : requisitionQuery.data?.approval.status.toLowerCase() ==
                    "rejected" ? (
                    <X size={"16"} className="text-destructive" />
                  ) : (
                    <Check size={"16"} className="text-primary" />
                  )}
                </span>
                <span className="opacity-60">
                  {requisitionQuery.data?.approval.status}
                </span>
              </p>
            </div>
            {requisitionQuery.data?.approval.status.toLowerCase() ===
              "pending" && (
              <div className="grid gap-1">
                <p className="text-lg font-bold">Approval Stage</p>
                <p className="capitalize opacity-60 inline-flex items-center gap-1">
                  <span>
                    {requisitionQuery.data?.approval.stage}
                    {["procurement", "finance"].includes(
                      requisitionQuery.data?.approval.stage.toLowerCase()
                    )
                      ? " Department "
                      : " "}
                    Approval
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
