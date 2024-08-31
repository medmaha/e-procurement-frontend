import ActionConfirmation from "@/Components/ActionConfirmation";
import React from "react";
import { deleteSubmittedEvaluation } from "../actions";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { DeleteIcon } from "lucide-react";

type Props = {
	data?: QuoteEvaluation;
	rfqItem: RFQItem;
	quotation: RFQResponse;
	updateReload: () => Promise<void>;
};

export default function RemoveButton(props: Props) {
	return (
		<ActionConfirmation
			description={<>Are you sure you want to remove this evaluation?</>}
			onConfirm={async (cb) => {
				const data = {
					item_id: props.rfqItem.id,
					quotation_id: props.quotation.id,
					eval_id: props.data?.id,
				};
				const response = await deleteSubmittedEvaluation(data);
				if (response.success) {
					await props.updateReload();

					cb();
				} else {
					toast.error(response.message, {
						toastId: "error",
						autoClose: 5000,
						position: "top-center",
						hideProgressBar: true,
					});
				}
			}}
		>
			<Button
				className="disabled:pointer-events-none gap-2"
				size={"sm"}
				variant={"destructive"}
			>
				<DeleteIcon className="w-4 h-4" />
				<span>Remove Evaluations</span>
			</Button>
		</ActionConfirmation>
	);
}
