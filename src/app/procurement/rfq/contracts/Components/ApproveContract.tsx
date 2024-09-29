"use client";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Button } from "@/Components/ui/button";
import React from "react";

type Props = {
  supplier: any;
  contract: any;
};

export default function ApproveContract({ contract, supplier }: Props) {
  return (
    <div className="md:pr-6">
      <ActionConfirmation
        onConfirm={async (callback) => {}}
        confirmText="Yes Approve"
        description={
          <>
            Are you sure you want to approve the contract award issued by{" "}
            <b>{contract.officer.name}</b> to <b>{supplier.name}</b> ?
          </>
        }
      >
        <Button size={"sm"}>Approve Contract</Button>
      </ActionConfirmation>
    </div>
  );
}
