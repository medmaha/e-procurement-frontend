"use client";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { createInvoice } from "../actions";

type Props = {
	quote_id: ID;
	totalSum: number;
	user: AuthUser;
};
export default function CreateInvoice(props: Props) {
	const router = useRouter();

	async function submit(formData: FormData) {
		const data = Object.fromEntries(formData.entries());
		const response = await createInvoice(data, location.pathname);
		if (response.success) {
			toast.success(response.message);
			redirect("/procurement/purchase-orders");
		}
		toast.error(response.message);
	}

	return (
		<form action={submit}>
			<input hidden name={"quote_id"} defaultValue={props.quote_id} />
			<div className="grid grid-cols-2 pointer-events-none gap-2">
				<div className="grid pt-6 gap-2 pointer-events-none">
					<Label className="font-semibold">Vendor</Label>
					<Input
						className="pointer-events-none"
						defaultValue={props.user.meta.vendor?.name}
					/>
				</div>
				<div className="grid pt-6 gap-2 pointer-events-none">
					<Label className="font-semibold">Amount</Label>
					<Input
						className="pointer-events-none"
						defaultValue={"D" + formatNumberAsCurrency(props.totalSum)}
					/>
				</div>
			</div>
			<div className="grid pt-6 gap-2">
				<Label className="font-semibold">Tax Amount</Label>
				<Input
					required
					type="number"
					name="text_amount"
					className=""
					placeholder="0.00"
				/>
			</div>
			<div className="grid pt-6 gap-2">
				<Label className="font-semibold">Due Date</Label>
				<Input required type="date" name="due_date" className="" />
			</div>
			<div className="grid pt-6 gap-2">
				<Label className="font-semibold">Payment Terms</Label>
				<Select name="payment_terms" required>
					<SelectTrigger>
						<SelectValue placeholder="Select Payment Terms" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{["net_30", "net_60", "net_90", "due_on_receipt", "custom"].map(
								(term) => {
									return (
										<SelectItem key={term} value={term}>
											{term.replace(/_/g, " ").toUpperCase()}
										</SelectItem>
									);
								}
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="grid pt-6 gap-2">
				<Label className="font-semibold">Notes</Label>
				<Textarea
					name="notes"
					required
					className="resize-none"
					placeholder="Add notes to the invoice..."
				/>
			</div>
			<div className="grid grid-cols-2 gap-4 mt-6">
				<SubmitButton
					type="button"
					onClick={() => router.back()}
					variant={"secondary"}
					text="No Cancel"
					normalBtn={true}
					className="text-base"
				/>
				<SubmitButton text="Submit Invoice" className="text-base" />
			</div>
		</form>
	);
}
