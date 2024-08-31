import React from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { publishRFQ } from "../actions";
import ActionConfirmation from "@/Components/ActionConfirmation";

export default function PublishRFQ({ rfq_id }: any) {
	async function handleSubmit(callback: any) {
		const response = await publishRFQ(
			{
				publish: true,
				rfq_id: rfq_id,
			},
			location.pathname
		);
		if (response.success) {
			toast.success(response.message);
			callback();
			return;
		}

		toast.error(response.message);
	}

	return (
		<ActionConfirmation
			onConfirm={async (callback) => handleSubmit(callback)}
			confirmText="Yes Publish"
			description={
				<span className="inline-block pb-4">
					Are you sure you want to publish this RFQ?
				</span>
			}
		>
			<Button size={"sm"} className={"sm:font-semibold"}>
				Publish
			</Button>
		</ActionConfirmation>
	);
}
