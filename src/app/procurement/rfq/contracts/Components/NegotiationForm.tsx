"use client";
import { Input } from "@/Components/ui/input";
import DeliveryTermsSelect from "@/Components/widget/DeliveryTermsSelect";
import PaymentMethodSelect from "@/Components/widget/PaymentMethodSelect";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import ActionButton from "@/Components/ActionButton";
import { Badge } from "@/Components/ui/badge";

type Props = {
	pricing?: string | number;
	validity_period?: string;
	payment_method?: string;
	delivery_terms?: string;
	note?: string;
	file?: string;
	contract_id?: ID;
	quotation_id?: ID;
	rfq_id?: ID;
	supplier_id?: ID;
	contract?: {
		id: string;
		status: string;
		officer: {
			id: ID;
			name: string;
		};
		approvable: boolean;
		terms_and_conditions: string;
	};
	submitNegotiation: (formData: FormData) => Promise<boolean>;
};

export default function RFQContractNegotiationForm(props: Props) {
	const { submitNegotiation } = props;
	return (
		<form action={submitNegotiation} className="px-2 sm:px-4 pb-4">
			<div className="mt-4 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-y-6">
				<div className="grid gap-2">
					<Label htmlFor="pricing" className="font-semibold">
						Pricing (GMD)
					</Label>
					<Input
						type="number"
						id="pricing"
						disabled={!!props.contract}
						name="pricing"
						defaultValue={props.pricing && Number(props.pricing)}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="delivery_terms" className="font-semibold">
						Delivery Period
					</Label>
					<DeliveryTermsSelect
						id={"delivery_terms"}
						required
						disabled={!!props.contract}
						defaultValue={props.delivery_terms && props.delivery_terms}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="payment_method" className="font-semibold">
						Payment Method
					</Label>
					<PaymentMethodSelect
						required
						id={"payment_method"}
						disabled={!!props.contract}
						defaultValue={props.payment_method && props.payment_method}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="file" className="font-semibold">
						Attachment
					</Label>
					{props.contract ? (
						<p className="text-sm rounded-md border p-2 text-muted-foreground">
							{props.file ? (
								<a
									href={props.file}
									target="_blank"
									className="underline underline-offset-2"
								>
									View File
								</a>
							) : (
								<span className="">No Attachment</span>
							)}
						</p>
					) : (
						<Input
							id={"file"}
							name="file"
							type="file"
							disabled={!!props.contract}
						/>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="validity_period" className="font-semibold">
						Validity Period
					</Label>
					<Input
						id={"validity_period"}
						name="validity_period"
						type="date"
						disabled={!!props.contract}
						defaultValue={props.validity_period && props.validity_period}
					/>
				</div>

				<div className="col-span-full">
					<div className="grid gap-2">
						<Label htmlFor="remarks" className="font-semibold">
							Terms and Conditions
						</Label>
						{props.contract ? (
							<p className="p-2 border rounded-md min-h-[100px]">
								{props.contract.terms_and_conditions}
							</p>
						) : (
							<Textarea
								id="remarks"
								name="note"
								required
								placeholder="Enter your terms and conditions"
								maxLength={250}
								defaultValue={props.note && props.note}
								className="max-h-[300px] min-h-[100px]"
							/>
						)}
					</div>
				</div>
			</div>
			<div className="pt-4 flex items-center gap-6 flex-wrap justify-center">
				<input type="hidden" name="is_negotiation" defaultValue={"true"} />
				{props.rfq_id && (
					<input type="hidden" name="rfq_id" defaultValue={props.rfq_id} />
				)}
				{props.quotation_id && (
					<input
						type="hidden"
						name="quotation_id"
						defaultValue={props.quotation_id}
					/>
				)}
				{props.supplier_id && (
					<input
						type="hidden"
						name="vendor_id"
						defaultValue={props.supplier_id}
					/>
				)}
				{props.contract_id && (
					<input
						type="hidden"
						name="contract_id"
						defaultValue={props.contract_id}
					/>
				)}

				<div className="mx-auto w-full text-center max-w-[300px]">
					{props.contract && <Badge variant={"success"}>Contracted</Badge>}
					{!props.contract && (
						<ActionButton
							text="Submit Negotiation"
							btnProps={{
								className: "text-lg w-full",
								type: "submit",
								size: "default",
							}}
						/>
					)}
				</div>
			</div>
		</form>
	);
}
