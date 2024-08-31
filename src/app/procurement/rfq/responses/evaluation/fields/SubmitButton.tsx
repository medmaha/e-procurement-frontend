import ActionConfirmation from "@/Components/ActionConfirmation";
import React from "react";
import { sanitizeEvaluationData } from "../utils";
import { submitForEvaluation } from "../actions";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Check } from "lucide-react";

type Props = {
	data?: QuoteEvaluation;
	rfqItem: RFQItem;
	disabled: boolean;
	quotation: RFQResponse;
	updateReload: () => Promise<void>;
};

export default function SubmitButton(props: Props) {
	return (
		<ActionConfirmation
			disabled={props.disabled}
			description={
				<>
					<b>Note</b> - This action is irreversible
					<br />
					Are you sure you want to submit for evaluation?
				</>
			}
			onConfirm={async (cb) => {
				const _data = sanitizeEvaluationData(
					props.data! || ({} as QuoteEvaluation),
					props.quotation,
					props.rfqItem
				);
				if (!_data) return;
				const response = await submitForEvaluation(_data);
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
				disabled={props.disabled}
				size={"sm"}
			>
				{props.disabled && <Check className="w-4 h-4" />}
				{props.disabled ? "Submitted" : "Submit for Evaluation"}
			</Button>
		</ActionConfirmation>
	);
}
