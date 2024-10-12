"use client";
import { AxiosError } from "axios";
import React, { ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import CreateRFQManager from "./CreateRFQManager";
import { PlusIcon } from "lucide-react";

type Props = {
  text?: string;
  user: AuthUser;
  rfq?: RFQ;
  children?: ReactNode;
};

export default function AddRFQ({ text, user, rfq, children }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button>
              <PlusIcon className="w-4 h-4" />
              Add Requisition
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[95svw] p-0 overflow-y-auto max-h-[97svh]">
          <DialogHeader className="border-b p-3 mb-0">
            <DialogTitle className="sm:text-2xl">
              {rfq ? "Edit RFQ" : "Create RFQ"}
            </DialogTitle>
            <DialogDescription>
              {rfq
                ? "Update the existing rfq details."
                : "Include a requisition-specific procurement rfq."}
            </DialogDescription>
          </DialogHeader>
          {isOpen && (
            <CreateRFQManager
              isOpen
              user={user}
              rfq={rfq}
              closeDialog={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function getErrorAsMessageFromAxiosError(error: AxiosError) {}
