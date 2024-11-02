"use client";
import React, { useMemo, useRef } from "react";
import { createContractApproval } from "../actions";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import { Button } from "@/Components/ui/button";
import Link from "next/link";

type Props = {
  supplier: any;
  contract: any;
};

export default function ApproveContract({ contract, supplier }: Props) {
  async function submitApproval(formData: FormData) {
    try {
      const response = await createContractApproval(
        contract.id,
        formData,
        location.pathname
      );
      if (response.success) {
        toast.success(response.message);
        return;
      }
      toast.error(response.message);
    } catch (error) {}
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>Approve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Contract</DialogTitle>
          <DialogDescription className="text-sm">
            You can approve the contract award issued by{" "}
            <Link
              scroll
              href={"/users/" + contract.officer.id}
              className="hover:link hover:underline underline-offset-2 transition"
            >
              <strong>{contract.officer.name}</strong>
            </Link>{" "}
            to{" "}
            <Link
              scroll
              href={"/suppliers/" + supplier.id}
              className="hover:link hover:underline underline-offset-2 transition"
            >
              <strong>{supplier.name}</strong>
            </Link>
            , please confirm.
          </DialogDescription>
        </DialogHeader>
        <form action={submitApproval} className="w-full block space-y-4 mt-4">
          <div className="grid gap-2">
            <Label>My Action</Label>
            <Select name="approve" required>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Disapproved</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Remarks</Label>
            <Textarea
              name="remarks"
              placeholder="Enter remarks"
              className="w-full"
              rows={4}
              minLength={10}
              maxLength={500}
            />
          </div>

          <div className="mt-4">
            <SubmitButton
              text="Submit Approval"
              className="w-full  md:font-semibold tracking-wide"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
