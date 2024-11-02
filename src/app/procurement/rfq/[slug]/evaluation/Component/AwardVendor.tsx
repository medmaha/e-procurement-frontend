"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Link from "next/link";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

interface AwardVendorProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: {
    name: string;
    totalAmount: number;
    deliveryTime: string;
    rating: number;
  };
  onAward: (closeAlertBox: () => void, data?: any) => Promise<void>;
}

export function AwardVendor({
  isOpen,
  onClose,
  vendor,
  onAward,
}: AwardVendorProps) {
  const [isAwarding, setIsAwarding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAward = async () => {
    try {
      setIsAwarding(true);
      const json = formRef?.current ? Object.fromEntries(new FormData(formRef.current)) : {};
      await onAward(() => {
        onClose();
      }, json);
    } catch (error) {
      //
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[95svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Vendor Award
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to award this RFQ to the following vendor?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-lg">{vendor.name}</h4>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Total Quote Amount: ${vendor.totalAmount.toLocaleString()}</p>
              <p>
                Delivery Time: {format(new Date(vendor.deliveryTime), "PPPP")}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            This action requires approval from an authorized{" "}
            <strong>Contract Approver</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Upon approval, all vendors will be notified
            of the award decision and the procurement will proceed to the next
            phase.{" "}
            <Link
              href={"/help/rfq-evaluation#awarding-vendor"}
              className="link"
            >
              Learn More
            </Link>
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="w-full block py-2"
        >
          <div className="space-y-2">
            <Label>
              Remarks/Comment{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              maxLength={150}
              name="remarks"
              placeholder="Please provide a brief comment or remarks for the award decision."
              className="resize-none"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isAwarding}>
            Cancel
          </Button>
          <ActionConfirmation
            disabled={isAwarding}
            onConfirm={handleAward}
            variant={"success"}
            confirmText="Yes Award"
            title="Continue Award"
            description="This action is irreversible and the approver will immediately get notified."
          >
            <Button disabled={isAwarding} variant={"success"}>
              {isAwarding ? (
                "Awarding..."
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Award Vendor
                </span>
              )}
            </Button>
          </ActionConfirmation>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
