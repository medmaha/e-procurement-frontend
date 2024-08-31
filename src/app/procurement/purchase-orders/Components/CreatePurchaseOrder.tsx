"use client";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import { createPurchaseOrder } from "../actions";

type Props = {
	quote_id: ID;
	user: AuthUser;
};
export default function CreatePurchaseOrder(props: Props) {
	const router = useRouter();

	async function submit(formData: FormData) {
		const data = Object.fromEntries(formData.entries());
		const response = await createPurchaseOrder(data, location.pathname);
		if (response.success) {
			toast.success(response.message);
			redirect("/procurement/purchase-orders");
		}
		toast.error(response.message);
	}

	return (
		<form action={submit}>
			<input hidden name={"quote_id"} defaultValue={props.quote_id} />
			<div className="grid pt-6 gap-2 pointer-events-none">
				<Label className="font-semibold">Officer</Label>
				<Input
					required
					className="pointer-events-none"
					defaultValue={props.user.name}
				/>
			</div>
			<div className="grid pt-6 gap-2">
				<Label className="font-semibold">Rationale/Comments</Label>
				<Textarea
					name="comments"
					required
					className="resize-none"
					placeholder="Add comments or rationale..."
				/>
			</div>
			<div className="grid py-6 gap-2">
				<Label className="font-semibold">Auto Publish</Label>
				<div className="inline-flex items-center gap-2">
					<Switch defaultChecked={true} className="" name="auto_publish" />
					<span className="text-muted-foreground text-xs">
						This will automatically publish the order, When the order is
						approved
					</span>
				</div>
			</div>
			<div className="grid pb-6 gap-2 pointer-events-none">
				<Label className="font-semibold">Requires Approval</Label>
				<div className="inline-flex items-center gap-2">
					<Switch
						checked
						className="pointer-events-none"
						name="requires_approval"
					/>
					<span className="text-muted-foreground text-xs">
						Your order will have to be approved before it is being publish
					</span>
				</div>
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
				<SubmitButton text="Purchase Order" className="text-base" />
			</div>
		</form>
	);
}
