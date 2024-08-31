"use client";
import ActionConfirmation from "@/Components/ActionConfirmation";
import { Button } from "@/Components/ui/button";
import React from "react";

type Props = {
	quotation: RFQResponse;
	contract: any;
};

export default function ApproveContract({ contract, quotation }: Props) {
	return (
		<div className="md:pr-6">
			<ActionConfirmation
				onConfirm={async (callback) => {}}
				confirmText="Yes Approve"
				description={
					<>
						Are you sure you want to approve the contract award issued by{" "}
						<b>{contract.officer.name}</b> to <b>{quotation.vendor.name}</b> ?
					</>
				}
			>
				<Button>Approve Contract</Button>
			</ActionConfirmation>
		</div>
	);
}
