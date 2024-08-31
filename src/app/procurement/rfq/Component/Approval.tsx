"use client";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import { approveRFQ } from "../actions";

type Props = {
  user: AuthUser;
  rfq: any;
  children: ReactNode;
};

export default function Approval(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-w-[500px] mx-auto p-0">
        <DialogHeader className="px-6 pt-4 pb-2">
          <DialogTitle className="text-xl sm:text-2xl capitalize">
            RFQ Approval
          </DialogTitle>
          <DialogDescription>
            Kindly examine the RFQ details outlined below and utilize the
            provided information.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80dvh] overflow-hidden overflow-y-auto px-6">
          {isOpen && (
            <RFQApprovalForm
              closeDialog={() => setIsOpen(false)}
              rfq={props.rfq}
              user={props.user}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const RFQApprovalForm = (props: any) => {
  const handleSubmit = async (formData: FormData) => {
    const response = await approveRFQ(formData, location.pathname);
    if (response.success) {
      toast.success(response.message);
      return props.closeDialog();
    }
    toast.error(response.message);
  };

  return (
    <form action={handleSubmit} className="max-w-md mx-auto">
      <input hidden name="rfq_id" defaultValue={props.rfq.id} />
      <div className="grid gap-2 md:grid-cols-2 mb-4">
        <div className="mb-4">
          <Label htmlFor="remark" className="font-semibold">
            Approval Officer
          </Label>
          <Input
            defaultValue={props.user.name}
            disabled
            className="disabled:opacity-80 p-0 h-max disabled:pointer-events-none border-none outline-none"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="remark" className="font-semibold">
            Approval Officer Profile
          </Label>
          <Input
            defaultValue={props.user.profile_type + " Profile"}
            disabled
            className="disabled:opacity-80 p-0 h-max disabled:pointer-events-none border-none outline-none"
          />
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="approve" className="font-semibold">
          Do you Approve?
        </Label>
        <Select name="approve" required>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select an option</SelectLabel>
              <SelectItem value="yes">Yes I Approve</SelectItem>
              <SelectItem value="no">No I Disapprove</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Textarea for remark */}
      <div className="mb-4">
        <Label htmlFor="remark" className="font-semibold">
          Remark
        </Label>
        <Textarea id="remark" name="remark" rows={2} />
      </div>

      {/* Submit button */}
      <div className="mb-4">
        <SubmitButton text="Submit Approval" />
      </div>
    </form>
  );
};
